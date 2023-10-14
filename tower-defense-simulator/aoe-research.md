aoe-calculation.mdGot it. Let's hone in on the AoE mechanics with your new insights.

Given your clarification:
1. Units can overlap in certain scenarios.
2. Slowing effects can stack up to a 95% overlap.

### Adjusting for Slow:

For the slowing effects, the idea to use a factor of `math.min(0.95, sumOfSlow)` is sound. This ensures that you'll never have more than a 95% overlap, regardless of how many slowing effects are applied.

So, if units come out every 1 second with a 10px gap and you have a 30% slow, the gap would indeed be reduced to 7px.

### Calculating Density:

With the data you provided for each wave, you can calculate the average flow rate as:

**Flow Rate (units per second) = Total Units / Total Time**

Now, for the density after the slowing effect is applied:

**Adjusted Flow Rate = Flow Rate / (1 + Sum of Slowing Effects)**

Where the sum of slowing effects is capped at 0.95.

### Factoring in Overlap:

Given the slowing effect can cause units to overlap, you'll need to adjust the effective length of the AoE. If we consider the AoE as a "length" rather than a "radius", then:

**Effective AoE Length = Base AoE Length * (1 - Overlap Percentage)**

This will give you the length of the area that is effectively being affected by the AoE attack at any given moment.

### Area of Effect Calculation:

Now, to determine how many units are within this effective AoE:

**Units Affected = Effective AoE Length / (Unit Width + Adjusted Gap)**

Where:
- **Unit Width** is the width of a single unit.
- **Adjusted Gap** is the gap between units after slowing effects are applied.


