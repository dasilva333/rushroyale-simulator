Let's hone in on the AoE mechanics with your new insights.

Given your clarification:
1. Units can overlap in certain scenarios.
2. Slowing effect rule is that units can only stack up to 2px apart from their center

### Adjusting for Slow:

For the slowing effects, when 100% slowing is applied units don't ever overlap 100%.

So, if units come out every 1 second with a 10px gap and you have a 30% slow, the gap would indeed be reduced to 7px.
The length of the track is available as well as the dimension of the units

### Calculating Density:

With the wave.json data you provided for each wave, you can calculate the average flow rate as:

**Flow Rate (units per second) = Total Units / Total Time**

Now, for the density after the slowing effect is applied:

**Adjusted Flow Rate = Flow Rate / (1 + Sum of Slowing Effects)**

Where the sum of slowing effects is maxed at 100 but 100% must maintain a 2px gap between each unit.

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

**Wave Specifications: Example for Wave 1**

---

Wave 1
Total units: 100
Total time: 65 seconds
First unit health: 50
Last unit health: 250
Minibosses health: 1000

---

**1. Total Units:**
- **Description:** Represents the cumulative count of enemy units that appear on the screen during the wave duration.
- **Value:** 100 units

**2. Wave Duration:**
- **Description:** The total time allotted for the wave, as indicated by the central timer. This measures from the moment the first unit appears until the timer runs out, assuming the player manages to keep pace with the incoming flow of units.
- **Value:** 65 seconds

**3. First Unit Health:**
- **Description:** Represents the health points of the very first enemy unit that enters the screen at the start of the wave.
- **Value:** 50 health points

**4. Last Unit Health:**
- **Description:** Indicates the health points of the last enemy unit seen on the screen before the wave timer runs out.
- **Value:** 250 health points

**5. Minibosses:**
- **Description:** Specific units within the wave that possess a higher health pool and often serve as a challenge for the player.
  - **Health:** 1000 health points 
  - **Count:** [Value not provided; needs to be recorded]

