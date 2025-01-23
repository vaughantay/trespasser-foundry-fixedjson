export const loadHandlebarsPartials = () => {
  const partials = [
		'systems/trespasser/templates/actor-adventurer-sheet.hbs',
		"systems/trespasser/templates/actor-monster-sheet.hbs",
    "systems/trespasser/templates/actor/adventurer/skills-tab.hbs",
    "systems/trespasser/templates/actor/adventurer/feature-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/equip-tab.hbs",
		"systems/trespasser/templates/actor/adventurer/combat-tab.hbs",
    'systems/trespasser/templates/actor/adventurer/spells-tab.hbs',
    "systems/trespasser/templates/actor/adventurer/equipment-slot.hbs",
    "systems/trespasser/templates/actor/adventurer/items/inventory-slot.hbs",
    'systems/trespasser/templates/actor/adventurer/items/list-spell.hbs',
    'systems/trespasser/templates/actor/adventurer/items/list-simple.hbs',
    'systems/trespasser/templates/actor/adventurer/items/list-action.hbs',
		'systems/trespasser/templates/actor/actor-adventurer-sheet.hbs',
		'systems/trespasser/templates/fields/text-field.hbs',
		'systems/trespasser/templates/item/item-spell-sheet.hbs',
		'systems/trespasser/templates/fields/number-field.hbs',
		'systems/trespasser/templates/fields/select-field.hbs',
		'systems/trespasser/templates/fields/bool-field.hbs',
		'systems/trespasser/templates/item/item-feature-sheet.hbs',
		'systems/trespasser/templates/item/item-talent-sheet.hbs',
		'systems/trespasser/templates/item/item-object-sheet.hbs',
		'systems/trespasser/templates/actor/adventurer/items/armor-slot.hbs'
  ]

  return loadTemplates(partials)
}
