---
description: Construir SPEC.md de punta a punta, sin pausas
---
## Antes de empezar
- Si SPEC.md no existe o no dice "Estado: aprobado", frená y avisame.
- Leé CLAUDE.md, SPEC.md y lo que haga falta de docs/.
- Creá la rama `build/<nombre-corto>` desde main.
- Activá la marca de build: `touch .claude/.build-active`. Mientras exista, no
  podés terminar con los tests en rojo.

## 1. Plan
Escribí TASKS.md: tareas chicas, en orden de contrato (backend primero, después
frontend). Por cada tarea, un micro-plan escrito para alguien sin contexto:
pasos ordenados, rutas de archivo exactas, qué criterio de SPEC.md cubre cada
paso y dónde vive su test. Seguí sin esperar mi ok.

## 2. Por cada tarea
1. Escribí primero el test de cada criterio testeable. Corrélo y confirmá que
   falla por la razón correcta.
2. Implementá lo mínimo para que pase. Nunca debilites, saltees o borres un test
   para ponerlo verde. Si agregás lógica nueva y la cantidad de tests no creció,
   esa lógica no está cubierta: marcala ⚠️, no ✅.
3. Corré tests y lint de la carpeta que tocaste.
4. Invocá al subagente `refuter` con la tarea. Si el veredicto es CORREGIR,
   arreglá y volvé a invocarlo (máximo 5 vueltas).
5. Si después de 5 vueltas sigue fallando, aplicá el protocolo de /debug (causa
   raíz antes de seguir) y anotá el hallazgo en DECISIONS.md. Si tampoco así
   avanza, dejá la tarea marcada ⚠️ con un reporte de dónde te trabaste y pasá
   a la siguiente que no dependa de ella.
6. Un commit por tarea (Conventional Commits), con el test y su código juntos.

## 3. Reglas durante el build
No me preguntes nada. Ante dudas menores, decidí y anotá en DECISIONS.md una
línea: "Ruling: qué — por qué — costo si está mal".
Si un criterio no se puede cumplir tal como está escrito, marcalo ⚠️ con el
motivo. Nunca lo reinterpretes en silencio.
Frená y preguntame SOLO si:
1. la operación es irreversible o destructiva,
2. toca secretos, auth o lógica de movimiento de fondos más allá de lo que pide
   SPEC.md,
3. tendría un efecto fuera de la rama (merge, push a main, estado de un entorno),
4. SPEC.md es tan inconsistente que cualquier camino sería adivinar.
Antes de frenar a preguntarme, borrá la marca: `rm -f .claude/.build-active`.

## 4. Al terminar
1. Corré tests, lint y build completos de backend y frontend. Todo en verde.
2. Borrá la marca: `rm -f .claude/.build-active`.
3. Subí la rama: `git push -u origin <rama>`.
4. Dame un resumen corto: qué se hizo, qué quedó ⚠️ y "Cómo probarlo": los
   comandos para levantar la app y los pasos para verificar cada criterio de
   aceptación.
