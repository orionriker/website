// Loaded async via LazyMotion so the drag/layout feature payload stays off
// the critical path. Resolve through .default: LazyMotion destructures the
// resolved value as {renderer, ...features}, so handing it the module
// namespace would register the bundle under a useless "default" key.
import { domMax } from 'framer-motion'

export default domMax
