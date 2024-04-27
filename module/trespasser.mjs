import { TRESPASSER } from './helpers/config.mjs';
import { TrespasserActor } from './actor/actor.mjs';
import { TrespasserActorSheet } from './sheets/actor-sheet.mjs';

Hooks.on("init", () => {
	CONFIG.Actor.dataModels.adventurer = AdventurerData;
});
