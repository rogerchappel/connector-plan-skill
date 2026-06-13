# Orchestration

Use this tool before an agent calls an external connector with possible side effects.

1. Collect the task JSON and connector manifest directory.
2. Run `connector-plan route` with the local policy file.
3. Review blocked connectors and selected connector evidence.
4. Run `connector-plan dry-run` on the saved route output.
5. Ask for approval when the plan lists gated writes, sends, or deletes.

The CLI never performs the eventual connector action. Treat the output as a review packet for a separate operator or tool invocation.
