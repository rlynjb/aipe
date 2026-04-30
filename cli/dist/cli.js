import 'dotenv/config';
import { Command } from 'commander';
import { SPEC_TYPES } from "./types.js";
const program = new Command();
program
    .name('aipe')
    .description('Spec workflow CLI for AI-assisted development')
    .version('0.1.0');
program
    .command('list')
    .description('List available spec types')
    .action(async () => {
    const { runList } = await import("./commands/list.js");
    await runList();
});
program
    .command('init')
    .description('Scaffold .aipe/ in the current project')
    .option('--global', 'Scaffold global config in ~/.config/aipe/ instead')
    .action(async (opts) => {
    const { runInit } = await import("./commands/init.js");
    await runInit({ global: !!opts.global });
});
program
    .command('generate <type> <intent...>')
    .description('Generate a filled spec for the given type and intent')
    .option('-o, --output <dir>', 'Override output directory (default: .aipe/specs/)')
    .option('-c, --context <path>', 'Override project context file')
    .option('-a, --agent <name>', 'Target agent: claude-code, codex, cursor, generic')
    .option('--dry-run', 'Skip the LLM call; print the assembled prompt')
    .option('--print', 'Print spec to stdout instead of saving')
    .action(async (type, intentParts, opts) => {
    const { runGenerate } = await import("./commands/generate.js");
    await runGenerate({
        type,
        intent: intentParts.join(' '),
        outputDir: opts.output,
        contextPath: opts.context,
        agent: opts.agent,
        dryRun: !!opts.dryRun,
        print: !!opts.print,
    });
});
program.addHelpText('after', `\nSpec types: ${SPEC_TYPES.join(', ')}\nSee 'aipe list' for descriptions.`);
try {
    await program.parseAsync(process.argv);
}
catch (err) {
    console.error(`aipe: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
}
//# sourceMappingURL=cli.js.map