// healthcheck.mts

const res = await fetch(`http://127.0.0.1:${process.env.PORT ?? 4321}/health`)
process.exit(res.ok ? 0 : 1)
