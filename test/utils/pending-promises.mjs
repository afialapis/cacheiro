import async_hooks from "node:async_hooks"

const pendingPromises = new Map()

const hook = async_hooks.createHook({
  init(asyncId, type) {
    if (type === "PROMISE") {
      const stack = new Error().stack.replace(/^Error\n/, "")

      const lines = stack.split("\n")
      const hasUserCode = lines.some((line) => {
        return (
          (line.includes("/cacheiro/") || line.includes("file://")) &&
          !line.includes("/test/utils/pending-promises.mjs")
        )
      })

      if (hasUserCode) {
        pendingPromises.set(asyncId, stack)
      }
    }
  },
  destroy(asyncId) {
    pendingPromises.delete(asyncId)
  },
  promiseResolve(asyncId) {
    pendingPromises.delete(asyncId)
  }
})

hook.enable()

process.on("exit", () => {
  if (pendingPromises.size > 0) {
    console.error(`\n🚨 Error: Found ${pendingPromises.size} pending promise(s) before exit! 🚨`)
    for (const [asyncId, stack] of pendingPromises) {
      console.error(`\n--- Pending Promise ID: ${asyncId} ---`)
      console.error(stack)
    }
    process.exitCode = 1
  }
})
