export const TRESPASSER = {};

TRESPASSER.DeedTiers = {
	"light": "TRESPASSER.DeedTiers.light",
	"heavy": "TRESPASSER.DeedTiers.heavy",
	"mighty": "TRESPASSER.DeedTiers.mighty",
		"special": "TRESPASSER.DeedTiers.special"
};

TRESPASSER.TargetTypes = {
	"creature": "TRESPASSER.TargetTypes.creature",
	"spread": "TRESPASSER.TargetTypes.spread",
	"special": "TRESPASSER.TargetTypes.special",
	"blast": "TRESPASSER.TargetTypes.blast",
	"path": "TRESPASSER.TargetTypes.path",
	"personal": "TRESPASSER.TargetTypes.personal"
};

TRESPASSER.TargetSpecs = {
	"melee": "TRESPASSER.TargetSpecs.melee",
	"close": "TRESPASSER.TargetSpecs.close"
};
TRESPASSER.WeaponTypes = {
	"melee": "TRESPASSER.WeaponTypes.melee",
	"missile": "TRESPASSER.WeaponTypes.missile",
	"spell": "TRESPASSER.WeaponTypes.spell",
	"unarmed": "TRESPASSER.WeaponTypes.unarmed"
};
TRESPASSER.DeedTypes = {
	"innate": "TRESPASSER.DeedTypes.innate",
	"spell": "TRESPASSER.DeedTypes.spell",
	"missile": "TRESPASSER.DeedTypes.missile",
	"item": "TRESPASSER.DeedTypes.item",
	"melee": "TRESPASSER.DeedTypes.melee",
	"unarmed": "TRESPASSER.DeedTypes.unarmed",
	"versatile": "TRESPASSER.DeedTypes.versatile"
};

TRESPASSER.Attributes = {
	"agility": "TRESPASSER.Ability.Agi.agility",
	"might": "TRESPASSER.Ability.Str.might",
	"intellect": "TRESPASSER.Ability.Vig.intellect",
	"spirit": "TRESPASSER.Ability.Knw.spirit",
};

TRESPASSER.PlayerSkills = {
	"acrobatics": "TRESPASSER.Skills.acrobatics",
	"alchemy": "TRESPASSER.Skills.alchemy",
	"athletics": "TRESPASSER.Skills.athletics",
	"crafting": "TRESPASSER.Skills.crafting",
	"folklore": "TRESPASSER.Skills.folklore",
	"letters": "TRESPASSER.Skills.letters",
	"magic": "TRESPASSER.Skills.magic",
	"nature": "TRESPASSER.Skills.nature",
	"perception": "TRESPASSER.Skills.perception",
	"speech": "TRESPASSER.Skills.speech",
	"stealth": "TRESPASSER.Skills.stealth",
	"tinkering": "TRESPASSER.Skills.tinkering"
}

TRESPASSER.ArmorSlots = {
	"head": "TRESPASSER.ArmorSlots.head",
	"body": "TRESPASSER.ArmorSlots.body",
	"arms": "TRESPASSER.ArmorSlots.arms",
	"legs": "TRESPASSER.ArmorSlots.legs",
	"outer": "TRESPASSER.ArmorSlots.outer",
	"shield": "TRESPASSER.ArmorSlots.shield"
};

TRESPASSER.Weights = {
	"L": "TRESPASSER.Weights.l",
	"M": "TRESPASSER.Weights.m",
	"H": "TRESPASSER.Weights.h"
};

TRESPASSER.DamageDiceSelections = {
	"4": "TRESPASSER.DamageDice.4",
	"6": "TRESPASSER.DamageDice.6",
	"8": "TRESPASSER.DamageDice.8",
	"10": "TRESPASSER.DamageDice.10",
	"12": "TRESPASSER.DamageDice.12"
};

TRESPASSER.ArmorDiceSelections = {
	"6": "TRESPASSER.DamageDice.6",
	"8": "TRESPASSER.DamageDice.8",
	"10": "TRESPASSER.DamageDice.10"
};

TRESPASSER.statusEffects = [
	{
    "id": "accurate",
    "name": "Accurate",
    "img": "icons/magic/perception/eye-ringed-glow-angry-small-teal.webp"
	},
	{
    "id": "inaccurate",
    "name": "Inaccurate",
    "img": "icons/magic/control/hypnosis-mesmerism-eye-tan.webp"
	},
	{
    "id": "guarded",
    "name": "Guarded",
    "img": "icons/skills/melee/shield-block-gray-orange.webp"
	},
	{
    "id": "unguarded",
    "name": "Unguarded",
    "img": "icons/skills/melee/shield-damaged-broken-blue.webp"
	},
	{
    "id": "fortified",
    "name": "Fortified",
    "img": "icons/magic/defensive/shield-barrier-deflect-teal.webp"
	},
	{
    "id": "frail",
    "name": "Frail",
    "img": "icons/skills/melee/shield-damaged-broken-gold.webp"
	},
	{
    "id": "hastened",
    "name": "Hastened",
    "img": "icons/magic/lightning/bolt-forked-large-orange.webp"
	},
	{
    "id": "hindered",
    "name": "Hindered",
    "img": "icons/creatures/webs/web-spider-glowing-purple.webp"
	},
	{
    "id": "mending",
    "name": "Mending",
    "img": "icons/magic/life/cross-worn-green.webp"
	},
	{
    "id": "poisoned",
    "name": "Poisoned",
    "img": "icons/magic/acid/dissolve-bone-skull.webp"
	},
	{
    "id": "strong",
    "name": "Strong",
    "img": "icons/magic/control/buff-strength-muscle-damage.webp"
	},
	{
    "id": "weak",
    "name": "Weak",
    "img": "icons/commodities/bones/bone-broken-grey.webp"
	},
	{
    "id": "swift",
    "name": "Swift",
    "img": "icons/skills/movement/feet-winged-boots-brown.webp"
	},
	{
    "id": "slow",
    "name": "Slow",
    "img": "icons/magic/nature/root-vine-entangle-foot-green.webp"
	},
	{
    "id": "willful",
    "name": "Willful",
    "img": "icons/creatures/magical/construct-iron-stomping-yellow.webp"
	},
	{
    "id": "weary",
    "name": "Weary",
    "img": "icons/magic/control/fear-fright-white.webp"
	},
	{
    "id": "bleeding",
    "name": "Bleeding",
    "img": "icons/skills/wounds/injury-triple-slash-bleed.webp"
	},
	{
    "id": "burning",
    "name": "Burning",
    "img": "icons/magic/fire/barrier-wall-flame-ring-yellow.webp"
	},
	{
    "id": "delirious",
    "name": "Delirious",
    "img": "icons/magic/control/fear-fright-monster-grin-purple-blue.webp"
	},
	{
    "id": "toppled",
    "name": "Toppled",
    "img": "icons/magic/movement/chevrons-down-yellow.webp"
	},
	{
    "id": "sleeping",
    "name": "Sleeping",
    "img": "icons/magic/control/sleep-bubble-purple.webp"
	}
];
