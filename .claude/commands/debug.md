---
description: Investigar un error hasta la causa raíz y arreglarlo ahí
---
Te voy a dar un síntoma (un error, un stack trace, un test que falla o algo que
no se comporta como dice SPEC.md). Seguí este orden:

1. Juntá evidencia primero: el error exacto, los logs de `logs/`, el estado de
   la operación en la base. Leé también docs/proveedores/ si interviene uno.
2. Reproducilo. Si no podés reproducirlo, decime eso: ya es un hallazgo.
3. Aislá un caso mínimo que falle.
4. Nombrá la causa en una frase, con evidencia archivo:línea. Distinguí dónde
   APARECE el error de dónde NACE (el síntoma puede estar en el frontend y la
   causa en el backend, o en cómo respondió un proveedor). Si tu explicación
   contiene "probablemente" o "de alguna manera", seguí aislando.
5. Escribí primero un test que falle por esa causa y después arreglá en la
   causa. El test de regresión es el criterio 1 de todo arreglo.
6. Radio de impacto: buscá el mismo patrón en otros lugares antes de dar el
   arreglo por terminado y corré todos los tests.

Nunca parches el síntoma: no agrandes timeouts, no agregues reintentos para
tapar un fallo, no aflojes asserts y no tragues errores con try/catch vacíos.

Si en dos pasadas completas no encontrás la causa, no inventes: entregame un
reporte de "trabado" con qué reprodujiste, qué descartaste, tu mejor hipótesis
y qué evidencia falta. En un sistema de pagos vale más que un arreglo
especulativo.
