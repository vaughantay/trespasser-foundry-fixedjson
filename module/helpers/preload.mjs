export const loadHandlebarsPartials = () => {
  const partials = [
		'systems/trespasser/templates/actor/actor-adventurer-sheet.hbs',
		'systems/trespasser/templates/fields/text-field.hbs',
		'systems/trespasser/templates/item/item-spell-sheet.hbs',
		'systems/trespasser/templates/fields/number-field.hbs',
		'systems/trespasser/templates/fields/select-field.hbs',
		'systems/trespasser/templates/fields/bool-field.hbs',
  ]

  return loadTemplates(partials)
}
