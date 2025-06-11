import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
    points:2,
    duration: 1,
})

export default limiter