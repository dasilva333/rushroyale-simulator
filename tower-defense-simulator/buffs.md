1. Basic Rules:

Units can be of two core distinctions:
Pure damage dealing units.
Support units which can also deal damage.
2. Witch Rules:

The Witch deals damage and provides a flat damage buff to all DPSUnits, including Grindstone and other Witches.
A Witch can buff itself when adjacent to another Witch.
3. Grindstone Rules:

Grindstone can be buffed by the Witch and can also buff the Witch.
Grindstone’s ability to boost other units' damage is chained. This means the Grindstone can inherit buffs from non-direct neighbors but only through other Grindstones.
4. Damage Calculation:

Total damage = dmgPerSecond + critDmgPerSecond.
If a unit has a base critical chance of 5%, for every 100 hits, it will land 5 critical hits.
CritDmgPerSecond is calculated by multiplying critical damage by the number of crit hits per second.
5. Grindstone Special Damage:

For a unit next to Grindstone, out of 100 hits:
5 will be critical hits based on the DamageDealer’s stats.
An additional number of hits will be critical based on Grindstone’s stats.
One hit from a DamageDealer can produce 2 damage numbers if both the DamageDealer and the Grindstone land a critical hit.
If there are 4 damage dealers attached to 1 grindstone, the combined critical hits from all units will be tallied.
6. Knight Statue Rules:

Increases the critical hit chance of adjacent units.
This boost can also increase the critical hit chance of a Grindstone.
7. General Buff Mechanics:

Buffs can be positional. For example, a unit that’s next to another unit can receive a buff.
Buffs can be chained, where a buffed unit can pass on the buff to another unit.
Some buffs do not stack, e.g., Banner & Knight. Units will use the highest available buff.
Some buffs do stack, e.g., damage buffs from different sources.