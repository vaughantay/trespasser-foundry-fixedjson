export const loadHandlebarsPartials = () => {
  const partials = [
		'systems/trespasser/templates/actor-adventurer-sheet.hbs',
  ]

  return loadTemplates(partials)
}
