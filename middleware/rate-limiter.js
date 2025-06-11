import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
    points:5,
    duration: 1,
})

export default limiter