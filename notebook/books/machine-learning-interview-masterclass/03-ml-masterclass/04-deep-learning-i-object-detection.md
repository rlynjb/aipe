# Chapter 3.4 — Deep Learning I: Detect and Process Objects in a Scene

**IK Section III, Module 4.** Reading time: 25 minutes.

> Object detection is the canonical computer vision interview question and the first one where deep learning is non-negotiable. Classical approaches plateau; convolutional networks blow past them. This chapter is the architecture-and-tradeoff walk of the modern CV pipeline.

## The prompt

> "Design an image processing system that detects and classifies objects in a scene. Input: an image. Output: bounding boxes around detected objects, each with a class label and confidence."

The applications: self-driving (detect cars, pedestrians, signs), retail (detect products on shelves), security (detect people in a frame), fitness (detect pose landmarks — contrl-mo's MediaPipe), social (detect faces, hands).

## The architecture

```
Input image
  │
  ▼
┌──────────────────────────────────┐
│ Preprocessing                    │
│  - Resize to model input size    │
│  - Normalize pixel values        │
│  - Batch                         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Candidate generation             │
│  - Where might objects be?       │
│  - "Region proposals" or         │
│    "anchor boxes"                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Detection model                  │
│  - CNN backbone                  │
│  - Per-region classification     │
│  - Per-region box refinement     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Postprocessing                   │
│  - Non-maximum suppression       │
│  - Confidence thresholding       │
│  - Class-aware filtering         │
└──────────────┬───────────────────┘
               │
               ▼
       Bounding boxes + labels
```

Two phases: **where are the objects** (candidate generation) and **what are they** (classification). Modern architectures fuse these but the conceptual split helps with debugging.

## CNN — the foundational layer

```
Convolutional neural network basics:

  Layer 1: convolutional filters applied to the image
    Each filter looks for a specific local pattern.
    Early layers learn edges and textures.
    Output: feature maps (one per filter).

  Layer 2-N: more convolutional layers + pooling
    Pooling: downsample (e.g., max-pool 2x2).
    Deeper layers see larger receptive fields.
    Middle layers learn object parts (eyes, wheels).
    Late layers learn whole-object concepts.

  Final layers: fully-connected for classification.

The genius of CNNs:
  - Local: each filter looks at a small patch.
    Local features compose into global ones.
  - Translation-invariant: same filter applied everywhere.
    An object in the top-left and an object in the bottom-right
    are recognized by the same filter.
  - Hierarchical: simple → complex features layer by layer.
```

For pre-2014 image classification, hand-engineered features (SIFT, HOG) were the norm. After AlexNet won ImageNet 2012 with a deep CNN, the field changed within 18 months. Modern image work uses CNNs (or transformers, which have similar properties for vision).

## Detection strategies — `[the four paradigms]`

### Strategy 1: Sliding window (legacy)

```
For each position (x, y) in the image:
  For each scale (small, medium, large):
    Extract the window.
    Classify: is there an object here? What class?
    If yes, record bounding box.

Output: list of windows that contain objects.

Problem: O(positions × scales × classes) per image. Too slow.
         Modern systems don't use raw sliding window.
```

### Strategy 2: R-CNN family (region-based)

```
R-CNN (2014):
  Step 1: Use selective search (or similar) to generate ~2000
           candidate regions per image.
  Step 2: For each region, run it through a CNN classifier.
  Step 3: Output the regions with high classification scores.

  Slow: 2000 CNN forward passes per image.

Fast R-CNN (2015):
  Run the CNN once on the whole image (produces a feature map).
  Crop regions from the feature map.
  Classify each cropped feature.

  Faster: one CNN pass per image.

Faster R-CNN (2015):
  Even the region proposal is done by a neural net (RPN).
  End-to-end trainable.

  This is the workhorse for accuracy-prioritized detection.
```

### Strategy 3: Single-stage detectors (YOLO, SSD)

```
YOLO (You Only Look Once):
  Divide the image into a grid (e.g., 7x7).
  For each grid cell, predict:
    - Bounding boxes (with offsets to cell center)
    - Confidence per box
    - Class probabilities

  One forward pass. Direct prediction.

Pros: Fast — real-time on consumer GPUs.
Cons: Lower accuracy than two-stage methods (historically;
      newer YOLO versions have closed the gap).

Use for: real-time detection (security cameras, autonomous driving,
         mobile applications).
```

YOLO is the dominant single-stage detector. Multiple versions: YOLOv3, v5, v8 — each iterates on speed and accuracy.

### Strategy 4: Transfer learning

```
Don't train from scratch. Take a pretrained model and fine-tune.

  Step 1: Start with a backbone (e.g., ResNet-50) pretrained on ImageNet.
  Step 2: Replace the final classification head with your task's head.
  Step 3: Optionally freeze the backbone weights; train only the head
           initially. Then unfreeze for fine-tuning.

Why this works: early layers learn general features (edges, textures,
                shapes) that apply across image domains. Late layers
                are task-specific.

For object detection: backbones come from ImageNet classification;
                      detection heads (Faster R-CNN, YOLO) are
                      trained on detection datasets (COCO, Pascal VOC).
```

Transfer learning is the standard. Training a detection model from random initialization is rare in industry — you almost always start from a pretrained backbone.

## Multiple object detection

Handling multiple objects per image is where naive single-classification approaches fail. The model must predict:

```
For each detected object:
  - Class label
  - Confidence score
  - Bounding box (x, y, width, height)

The model outputs many candidate detections per image.
Most are duplicates (multiple detections of the same object).
Non-maximum suppression (NMS) deduplicates.
```

### Non-maximum suppression

```
NMS algorithm:
  1. Sort all detections by confidence (descending).
  2. Pick the highest-confidence detection.
  3. Remove all other detections with IoU > threshold (e.g., 0.5)
     and same class.
  4. Repeat with the next-highest remaining.
  5. Continue until no detections remain.

IoU (Intersection over Union):
  IoU = (area of intersection) / (area of union)
  Range: 0 to 1.
  IoU > 0.5: significant overlap. Same object.

Output: the deduplicated detection list.
```

NMS is one of the most-asked computer vision implementation questions. Be ready to implement it. The pseudocode is short:

```
function nms(detections, iou_threshold):
    sorted = detections sorted by confidence desc
    keep = []
    while sorted is not empty:
        top = sorted.pop_first()
        keep.append(top)
        sorted = [d for d in sorted if iou(d.box, top.box) < iou_threshold]
    return keep
```

## Handling missing ground truth labels

One of the IK module's emphasis areas. When you build a detection dataset, you label objects in the image. But your labelers will miss some.

```
Examples of missed labels:
  - Partially occluded objects not labeled (the labeler didn't see them).
  - Small objects at image edges not labeled.
  - Ambiguous categories (is this a "car" or a "vehicle"?).

Why it matters:
  Training: the model sees missed objects as "negative" examples.
            It learns to predict "no object here" for objects that
            are actually present. Performance degrades.

Mitigations:
  - Multiple labelers per image; majority vote.
  - Active learning: surface model's high-confidence "objects" that
    weren't labeled — they're likely missed labels.
  - Pre-train on weakly-labeled datasets (web images with captions),
    fine-tune on cleaner labels.
  - Use semi-supervised approaches (teacher-student) to leverage
    unlabeled data.
```

## Dropout in small networks

The IK module specifically calls this out.

```
Dropout: during training, randomly zero out a fraction of neurons
         (e.g., 50%) on each forward pass. At inference, use all
         neurons but scale outputs down by the dropout fraction.

Effect:
  - Prevents co-adaptation: no single neuron can rely on a specific
    other neuron being present.
  - Forces redundancy: many neurons must learn each feature.
  - Acts as ensemble: each forward pass is a different "subnetwork."

In small networks:
  Higher dropout (50%) prevents overfitting on limited data.

In large networks:
  Lower dropout (10-20%) or no dropout. Batch normalization often
  serves a similar regularization role.

In transformers / modern architectures:
  Dropout is used but often deemphasized; LayerNorm and large data
  do most of the regularization.
```

## Vanishing / exploding gradients in CNNs

```
Vanishing gradients:
  In deep networks, gradients propagated back through many layers
  shrink toward zero. Early layers don't update. Network can't learn.

  Cause: derivatives of activation functions (sigmoid, tanh) are
         small. Multiplying many small numbers approaches zero.

Exploding gradients:
  Opposite problem. Gradients grow exponentially through layers.
  Weights become NaN. Training diverges.

Mitigations:
  - ReLU activation (derivative is 1 for positive inputs; doesn't
    shrink with depth).
  - Batch normalization (normalizes activations between layers).
  - Residual connections (ResNet — add skip connections so gradients
    can flow directly to early layers).
  - Gradient clipping (cap gradient magnitudes per step).
  - Careful weight initialization (He, Xavier).

In modern architectures (ResNet, transformers):
  Vanishing gradients are largely solved.
  Skip connections are the key — they let gradient flow directly
  through depth.
```

## Learning rate optimization

```
Learning rate (η): how big a step gradient descent takes per update.

  Too high:    training oscillates, doesn't converge.
  Too low:     training is slow, may get stuck in local minima.

Strategies:

  Constant learning rate:
    Set η = 0.001 or 0.0001. Adjust manually if not converging.

  Learning rate schedule:
    Start high (0.01), decay over time (0.001, 0.0001).
    Common: step decay (divide by 10 every N epochs),
             cosine annealing, exponential decay.

  Warmup:
    Start very small, ramp up over first epochs.
    Helps with large-batch training and large models.

  Adaptive optimizers (Adam, AdamW):
    Per-parameter learning rate, adjusted based on gradient history.
    Robust to learning-rate choice — works without much tuning.
    The default for most modern training.
```

For an interview answer: "I'd use AdamW with a cosine learning rate schedule. Initial LR around 1e-4 for fine-tuning a pretrained backbone, 1e-3 for the new head. Warmup for the first 500 steps if training is large."

## Interview-relevant strategies

What the IK curriculum is preparing you for:

```
The detection interview shape:

  1. Walk the architecture.
     "I'd use Faster R-CNN if accuracy is the priority, YOLO
      for real-time. Both share a backbone — I'd start with
      ResNet-50 pretrained on ImageNet and fine-tune."

  2. Walk the training pipeline.
     "Training data is COCO or domain-specific. I'd augment
      with random crops, flips, color jitter. Loss is the
      sum of classification loss and box regression loss
      with task-specific weights."

  3. Name the metrics.
     "Mean Average Precision (mAP) at IoU thresholds 0.5, 0.75,
      and averaged. Per-class precision and recall. Latency
      per image on target hardware."

  4. Name the failure modes.
     "Small objects (low recall on objects covering few pixels).
      Crowded scenes (NMS suppression error). Domain gap
      (model trained on studio shots fails on phone shots).
      Adversarial inputs (perturbations cause misclassification)."

  5. Discuss scale.
     "For deployment: quantize to int8, distill to a smaller model,
      run on GPU or specialized accelerators (TPU, edge TPU).
      For training: distributed across GPUs, mixed precision (fp16),
      gradient accumulation for large effective batch sizes."
```

## The case study walk

**Functional requirements:**
- Detect 80 object classes (COCO categories) in real-time video.
- Bounding boxes + class labels + confidences.
- Handle 30fps on a target device (depends on use case).

**Non-functional requirements:**
- Latency: < 33ms per frame (for 30fps).
- mAP: aim for 0.40+ at IoU 0.5 (state-of-the-art on COCO is 0.55+).
- Model size: depends on target — < 50MB for mobile, no constraint for cloud.

**Architecture:**

```
Input frame (640x640)
  │
  ▼
Backbone CNN (ResNet-50 or YOLOv8 backbone)
  │  feature map (e.g., 20x20x256)
  ▼
Detection head (anchor-based or anchor-free)
  │  ~25k candidate detections per image
  ▼
Class confidence + box regression
  │
  ▼
Postprocessing
  - Confidence threshold (e.g., 0.5)
  - NMS (IoU threshold 0.45)
  ▼
Final detections (typically 5-50 per image)
```

**Training pipeline:**

- Dataset: COCO + domain-specific augmentation.
- Augmentation: random crop, flip, color jitter, mosaic (YOLOv4+ trick).
- Loss: classification (cross-entropy) + box regression (smooth L1 or GIoU).
- Optimizer: AdamW with cosine annealing.
- Backbone initialization: ImageNet pretrained, fine-tuned.

**Deployment options:**

- **Server / cloud:** GPU inference, larger model, batch processing.
- **Edge / mobile:** quantize to int8, prune small filters, run on ONNX Runtime Mobile / TFLite / Core ML. This is the contrl-mo deployment shape.

## How interviewers probe object detection

Three layers:

1. **Surface:** "How does YOLO work?" Tests whether you know grid-based detection.
2. **Standard:** "Walk me through training an object detector for a custom dataset." Tests whether you know transfer learning, data augmentation, evaluation.
3. **Twist:** "Your model performs well on COCO but poorly on your client's CCTV footage. What do you do?" Tests domain gap mitigation: fine-tune on client data, augment training with target-domain patterns, retrain with domain-specific augmentation.

## The Interview Move

> *"For object detection in real-time, I'd start with YOLOv8 — single-stage, fast on consumer hardware, with a strong off-the-shelf checkpoint. Backbone is pretrained on ImageNet, fine-tuned on the target dataset with COCO-style augmentation plus domain-specific augmentation. Loss combines classification cross-entropy and GIoU box regression. Postprocess with NMS at IoU 0.45 and confidence threshold 0.5 (tuned on val set). Metrics: mAP@0.5 and mAP@0.5:0.95. Failure modes I'd watch for: small objects, crowded scenes where NMS over-suppresses, domain shift if deployment environment differs from training. For deployment to a mobile device or edge accelerator, I'd quantize to int8 and measure end-to-end latency on real hardware — simulators lie. The model in contrl-mo follows this exact pattern: MediaPipe pose detection is a CNN landmark detector pretrained on diverse fitness data, fine-tuned for the deployment environment."*

Mention of contrl-mo at the end ties the IK template to your actual codebase — the exact senior move from the spec template's "Applies to this codebase" bullet.

Next chapter: deep learning II. Tech support chatbot — where NLP and retrieval converge.
