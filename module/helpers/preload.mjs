export const loadHandlebarsPartials = () => {
  const partials = [
		'systems/trespasser/templates/actor-adventurer-sheet.hbs',
		'systems/wildsea/templates/fields/text-field.hbs',
		'systems/wildsea/templates/item/item-spell-sheet.hbs',
  ]

  return loadTemplates(partials)
}
