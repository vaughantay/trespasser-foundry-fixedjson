export const loadHandlebarsPartials = () => {
  const partials = [
		'systems/trespasser/templates/actor-adventurer-sheet.hbs',
    "systems/trespasser/templates/actor/adventurer/skills-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/equip-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/combat-tab.hbs",
    "systems/trespasser/templates/actor/adventurer/equipment-slot.hbs"
  ]

  return loadTemplates(partials)
}
