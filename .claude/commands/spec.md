---
description: Entender qué construir y escribir SPEC.md (con prototipo visual si hay pantallas)
---
Leé CLAUDE.md y, si existen, docs/negocio.md y docs/proveedores/.

Entrevistame de a UNA pregunta por vez, en lenguaje llano, en este orden:
1. El problema y para quién es (con ejemplos concretos).
2. El flujo paso a paso.
3. Los casos borde (falla un proveedor, llega un webhook repetido, el usuario
   abandona a la mitad, el monto cambia entre la cotización y el pago).
4. Dos o tres direcciones de solución con sus trade-offs; yo elijo.
5. Cómo sabremos que funciona.

Si algo depende de cómo se comporta un proveedor y no está en docs/proveedores/,
decímelo en vez de suponerlo.

Si la funcionalidad tiene pantallas, antes de pedirme aprobación generá
`prototype/index.html`: un archivo único, con datos falsos y sin backend, que
muestre cada pantalla y cada estado (éxito, error, cargando) y se pueda
clickear entre ellos. Decime cómo abrirlo en el navegador y ajustalo con mis
comentarios hasta que me guste.

Escribí SPEC.md con: objetivo, flujo, pantallas confirmadas (si las hay),
criterios de aceptación (una lista de cosas verificables, escritas en lenguaje
de producto) y fuera de alcance.

Mostrámelo y esperá mi "aprobado". Solo entonces agregá la línea
"Estado: aprobado" al principio de SPEC.md. No construyas nada en este comando.
