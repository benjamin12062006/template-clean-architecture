/**
 * @module EstadisticasModule — Barrel export
 *
 * Punto de entrada publico del modulo estadisticas.
 * Solo se exporta lo que las capas superiores necesitan.
 * Las capas internas (domain, infrastructure) NO se exponen aqui.
 */

// View — consumida por app/
export { EstadisticasPageView } from './presentation/views/estadisticas-page.view';

// Composition — consumida por src/composition/
export { createEstadisticasModule } from '@composition/estadisticas/create-estadisticas-module';
