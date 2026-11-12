# CONTEXT.md · Aprendizaje: Desarrollo con agentes de IA (TaskFlow AI)

> Documento vivo y fuente de verdad del aprendizaje. El agente lo lee al iniciar cada lección y se actualiza al cerrarla.

## Índice
- [Estado actual](#estado-actual)
- [1. Propósito](#1-propósito)
- [2. Perfil del estudiante](#2-perfil-del-estudiante)
- [3. Mapa del temario](#3-mapa-del-temario)
- [4. Glosario](#4-glosario)
- [5. Dependencias entre sesiones](#5-dependencias-entre-sesiones)
- [6. Hilo conductor del proyecto](#6-hilo-conductor-del-proyecto)
- [7. Estructura del repositorio](#7-estructura-del-repositorio)
- [8. Bitácora de lecciones](#8-bitácora-de-lecciones)
- [9. Stack y herramientas](#9-stack-y-herramientas)
- [10. Prerrequisitos](#10-prerrequisitos)
- [11. Convenciones para el agente](#11-convenciones-para-el-agente)

---

## Estado actual

| Campo | Valor |
|---|---|
| Lección en curso | Ninguna (preparación) |
| Última lección completada | Ninguna: aún no se ha completado ninguna lección |
| Última actualización | 2026-11-11 |
| Siguiente paso concreto | Paso 2: definir el plan de estudio semanal (~2 sesiones/semana hasta fin de diciembre). Después, Paso 3: estructura inicial del repo (README, CLAUDE.md, carpeta de la Sesión 1) en la rama `sesion-01-harness` |
| Progreso | 0 / 15 sesiones listadas (ver nota del Módulo 6) |

---

## 1. Propósito

Aprender a desarrollar software con agentes de IA (Claude Code) de forma disciplinada: diseñar el entorno de trabajo del agente (harness), pasar de un problema a un PRD y a specs, garantizar calidad con TDD, evals y guardarraíles, construir un producto con IA (RAG y agente propio) y llevarlo a producción con DevSecOps.
El vehículo es **TaskFlow AI**, construido lección a lección en un repositorio que sirve a la vez como proyecto de estudio y portafolio.

---

## 2. Perfil del estudiante

| Campo | Valor |
|---|---|
| Nivel actual | Full-stack senior |
| Tiempo disponible | Hasta 10 h/semana |
| Stack que domina | Full-stack (tecnologías concretas por precisar) |
| Fecha objetivo | Antes de terminar diciembre de 2026 |

**Capacidad estimada:** del 2026-11-11 al 2026-12-31 hay ~7 semanas → ~70 h para 15 sesiones ≈ **4.5 h por sesión** (unas 2 sesiones por semana). Es un ritmo exigente; el plan semanal (Paso 2) prioriza los entregables de cada sesión sobre la profundidad opcional.

---

## 3. Mapa del temario

Leyenda: `[ ]` pendiente · `[~]` en curso · `[x]` completada

### Módulo 1 · Desarrollo con agentes de IA (3 sesiones · 15 temas)

- [ ] **Sesión 1. Harness Engineering: el entorno de trabajo del agente**
  - Claude Code pieza por pieza: CLAUDE.md, skills, hooks, subagentes, plan mode y MCP
  - Qué es un harness y por qué cambia el resultado al trabajar con agentes
  - Demo comparada: la misma tarea de TaskFlow AI con y sin harness
  - Del ticket al pull request: plan, implementación y revisión automática
  - Panorama de agentes de código y criterio para elegir entre ellos
- [ ] **Sesión 2. Del problema al PRD y al backlog**
  - Mentalidad de producto: del developer que implementa al que decide qué se construye
  - Job-to-be-done, benchmark, competencia y pricing con deep research
  - El PRD versionado como fuente de verdad del proyecto
  - Épicas, historias de usuario y criterios Given/When/Then
  - Requisitos no funcionales y tickets con prioridad y dependencias
- [ ] **Sesión 3. Spec Driven Development: de la spec al código**
  - La spec como contrato: contexto, reglas y criterios de aceptación
  - Contratos de datos e interfaces antes de la lógica
  - Implementar una historia: proponer, revisar el contrato y aplicar
  - Evolucionar una spec existente y verificar que el código la cumple
  - Cuándo no conviene usar Spec Driven Development

### Módulo 2 · Calidad y gobierno del agente de código (3 sesiones · 19 temas)

- [ ] **Sesión 4. Revisión adversarial, TDD y documentación viva**
  - Pruebas en verde que casi no cubren nada: cómo detectar la falsa cobertura
  - TDD: el test como contrato, escrito antes del código a partir de los criterios del PRD
  - Pruebas de integración desde los criterios de aceptación, en rojo primero
  - Pirámide de test y bases de datos de prueba con Vitest
  - El harness como garante del ciclo TDD
  - Documentación viva: diagramas, contrato de API y decisiones de arquitectura dentro del PR
  - Revisión adversarial con agentes y arbitraje de falsos positivos
- [ ] **Sesión 5. MCP y Skills propios: amplía tu harness**
  - Model Context Protocol: ciclo de vida de un servidor y permisos
  - Un servidor MCP propio que lee los assets públicos y el mapa del sitio
  - Arquitectura de Custom Skills y validadores automáticos de código
  - Una Skill de Tech Lead que audita accesibilidad y SEO técnico
  - Delegar la reducción de deuda técnica a los agentes
- [ ] **Sesión 6. Guardarraíles y evals del harness: ¿funciona de verdad?**
  - Auditar las reglas del agente contra el historial de git: ¿se cumplen de verdad?
  - Guardarraíles deterministas en CI y un agente revisor con GitHub Actions
  - Costo de los agentes: calibrar modelo, effort y caché de prompt
  - ¿Sirve tu harness? Medición con y sin harness
  - ¿Se cumple tu regla? Líneas base, varios ensayos y comparación entre modelos
  - Evals que mienten y juez automático calibrado contra el criterio de una persona
  - Cerrar el ciclo: convertir una regla validada en guardarraíl

### Módulo 3 · IA en el ciclo de desarrollo: backend y frontend (2 sesiones · 11 temas)

- [ ] **Sesión 7. Backend con Supabase: el agente ejecuta el contrato**
  - App Router y Server/Client Components en Next.js 16
  - Arquitectura por capas: la lógica del negocio separada de la base de datos
  - Migraciones SQL generadas y ejecutadas con ayuda del agente
  - Inspección del esquema real con agentes y cambios de esquema sin romper nada
  - Row Level Security y sus pruebas
  - Datos de prueba generados por agentes
- [ ] **Sesión 8. Frontend: del boceto al design system y su testing**
  - Del wireframe a React con Claude Vision, Tailwind y Shadcn/UI
  - Que el agente reutilice el catálogo de componentes en lugar de inventar piezas
  - Tokens y design system ejecutable con sus historias
  - Conectar la interfaz a Supabase: estados de carga y cero errores silenciosos
  - Pruebas E2E con Playwright antes del push

### Módulo 4 · Creación de productos con IA: RAG y agente propio (4 sesiones · 25 temas)

- [ ] **Sesión 9. RAG y pgvector: productos con memoria propia**
  - Arquitectura y flujo de un sistema RAG
  - Embeddings con un modelo especializado (Anthropic recomienda Voyage AI)
  - Columnas vectoriales con pgvector, índices y chunking
  - Búsqueda semántica combinada con filtros de RLS
  - Indexación automática de cada ítem nuevo del catálogo
  - Cómo combinar el conocimiento privado con las consultas del usuario
- [ ] **Sesión 10. Del chatbot al agente: el bucle, las herramientas y el cambio de modelo**
  - Agent = Model + Harness: qué parte es del modelo y qué parte construye uno
  - El chat embebido en el website con streaming, a partir de una plantilla base
  - El bucle del agente paso a paso: contexto, llamada al modelo, herramienta, resultado, repetir
  - El mismo bucle de dos formas: con createAgent y armado a mano con StateGraph
  - Herramientas con esquema Zod: la búsqueda del catálogo de la sesión 9 y el servidor MCP de la sesión 5
  - Prevención de alucinaciones: el agente responde con lo que devuelven sus herramientas
  - Cambio de modelo con initChatModel: Sonnet, Grok u otro, sin tocar el resto
- [ ] **Sesión 11. Memoria, contexto y aprobación humana**
  - Estado de una tarea frente a memoria entre conversaciones
  - Memoria de conversación con PostgresSaver en la misma base de Supabase, identificada por thread_id
  - Memoria de largo plazo con PostgresStore: lo que el agente recuerda del cliente
  - Conversaciones largas: por qué se degradan y cómo el middleware de resumen lo evita
  - Aprobación humana: pausar con interrupt(), mostrar la acción en el website y reanudar
  - Deep Agents como ejemplo de un harness completo ya armado: cuándo usarlo en lugar de construir
- [ ] **Sesión 12. Controles, seguridad y evaluación del agente**
  - Middleware propio con createMiddleware: reglas antes y después de cada llamada al modelo o a una herramienta
  - Controles integrados: límite de llamadas, datos personales, reintentos y modelo de respaldo
  - Inyección de prompt en un agente con herramientas: la tríada letal y las mitigaciones de OWASP
  - Trazas en LangSmith: cada paso, su duración y su costo
  - Evaluación con un dataset de 20 casos sacados de fallos reales y un modelo como juez con rúbrica
  - Podar el harness: quitar una pieza, medir y decidir si se queda

### Módulo 5 · DevSecOps: seguridad, despliegue y observabilidad (2 sesiones · 13 temas)

- [ ] **Sesión 13. Seguridad del producto y del agente: tu reporte de seguridad**
  - Secretos y APIs que consumen servicios de Anthropic: cómo protegerlos
  - Análisis estático con CodeQL, dependencias con Dependabot y escaneo de secretos
  - Escaneo dinámico de la web desplegada con OWASP ZAP
  - Datos sensibles y límites de alcance: qué ve el agente y qué no
  - Instrucciones maliciosas escondidas en el backlog o en el código
  - La seguridad del agente: integrar los controles de la sesión 12 al reporte
- [ ] **Sesión 14. CI/CD y observabilidad 360: pipeline y tablero del producto**
  - Despliegue continuo en Vercel con vistas previas por rama
  - Configuración y migraciones versionadas como código
  - GitHub Actions: lint, Vitest, Playwright y las evals del agente como puertas del pipeline
  - Bloqueo de merges por umbral de calidad y seguridad
  - Instrumentación, trazas, SLOs y alertas
  - Core Web Vitals con ayuda de la IA y prueba E2E programada contra producción
  - Tablero técnico, del agente y de negocio: conversación, carrito y pedido

### Módulo 6 · Pipeline completo y Demo Day (2 sesiones · 9 temas)

- [ ] **Sesión 15. War Room: de spec a producción**
  - Repaso del flujo completo: PRD, spec, harness, código y pipeline
  - Casos límite y depuración
  - Una funcionalidad urgente en vivo, de la spec a producción
  - Incidente simulado: de seguridad o una regresión que detectan las evals y los guardarraíles
  - Congelamiento del código y versión final

> **Nota:** el temario indica 2 sesiones y 9 temas para el Módulo 6, pero solo incluye la Sesión 15 (5 temas). La sesión restante (presumiblemente el Demo Day) queda **abierta por decisión del estudiante**: se completará por cuenta propia como estudio continuo. No se planifica ni se cuenta en el progreso hasta que tenga contenido.

---

## 4. Glosario

| Término | Definición breve |
|---|---|
| **Agente de código** | Modelo de IA que lee, planea, edita y ejecuta código con herramientas, en un bucle, hasta cumplir una tarea. |
| **Harness** | Todo lo que rodea al modelo y condiciona su trabajo: instrucciones (CLAUDE.md), skills, hooks, subagentes, herramientas MCP, permisos y validaciones. *Agent = Model + Harness.* |
| **CLAUDE.md** | Archivo de instrucciones persistentes del proyecto que Claude Code carga como contexto. |
| **Skill** | Paquete de instrucciones (y scripts opcionales) que enseña al agente a hacer un tipo de tarea de forma repetible. |
| **Hook** | Comando que se ejecuta automáticamente en eventos del agente (antes/después de una herramienta, al terminar, etc.) para validar o bloquear. |
| **Subagente** | Agente secundario con contexto y herramientas propias, al que se delega una subtarea. |
| **Plan mode** | Modo en que el agente investiga y propone un plan sin modificar archivos hasta que se aprueba. |
| **MCP (Model Context Protocol)** | Protocolo estándar para exponer herramientas, recursos y prompts de un servidor a un agente. |
| **PRD** | *Product Requirements Document*: describe problema, usuarios, alcance, requisitos y métricas. Aquí, versionado en el repo. |
| **Job-to-be-done (JTBD)** | El "trabajo" que el usuario intenta resolver al contratar un producto; guía qué construir. |
| **Historia de usuario** | Requisito desde la perspectiva del usuario ("Como…, quiero…, para…"), agrupado en épicas. |
| **Given/When/Then** | Formato de criterio de aceptación: contexto inicial, acción y resultado esperado. Base para tests. |
| **Requisito no funcional (RNF)** | Atributo de calidad: rendimiento, seguridad, accesibilidad, costo, disponibilidad. |
| **Spec Driven Development (SDD)** | Desarrollo donde una especificación (contexto, reglas, contratos, criterios) es el contrato que el agente implementa y contra el que se verifica. |
| **Contrato de datos / interfaz** | Definición de tipos, esquemas y firmas que se fija antes de la lógica. |
| **TDD** | *Test Driven Development*: escribir el test (en rojo) antes del código que lo hace pasar. |
| **Falsa cobertura** | Tests en verde que ejecutan código sin verificar comportamiento real. |
| **Pirámide de test** | Proporción recomendada: muchos unitarios, menos de integración, pocos E2E. |
| **Revisión adversarial** | Un agente revisa el trabajo de otro buscando fallos; una persona arbitra falsos positivos. |
| **Documentación viva** | Diagramas, contrato de API y ADRs que se actualizan dentro del mismo PR que el código. |
| **ADR** | *Architecture Decision Record*: registro breve de una decisión de arquitectura y su porqué. |
| **Guardarraíl** | Control (preferentemente determinista, en CI o hooks) que impide que una regla se incumpla. |
| **Eval** | Prueba que mide el comportamiento de un agente o harness sobre un conjunto de casos, con varios ensayos y línea base. |
| **Juez automático (LLM-as-judge)** | Modelo que califica salidas con una rúbrica; debe calibrarse contra el criterio humano. |
| **Caché de prompt / effort** | Palancas de costo: reutilizar prefijos de contexto y ajustar cuánto razona el modelo. |
| **RLS (Row Level Security)** | Políticas de PostgreSQL que limitan qué filas puede leer o escribir cada usuario. |
| **Migración** | Cambio versionado del esquema de la base de datos. |
| **Server/Client Components** | En Next.js App Router, componentes que se renderizan en servidor o en navegador. |
| **Design system / tokens** | Catálogo de componentes y variables de diseño (color, espaciado, tipografía) reutilizables. |
| **E2E** | Pruebas de extremo a extremo que operan la app como un usuario (Playwright). |
| **RAG** | *Retrieval-Augmented Generation*: recuperar conocimiento propio relevante y dárselo al modelo para responder. |
| **Embedding** | Vector numérico que representa el significado de un texto. |
| **pgvector** | Extensión de PostgreSQL para columnas vectoriales y búsqueda por similitud. |
| **Chunking** | Dividir documentos en fragmentos para indexarlos. |
| **Bucle del agente** | Ciclo contexto → llamada al modelo → herramienta → resultado → repetir. |
| **Alucinación** | Respuesta inventada que no se apoya en datos; se mitiga obligando a responder con lo que devuelven las herramientas. |
| **Checkpointer / thread_id** | Persistencia del estado de una conversación (PostgresSaver), identificada por un hilo. |
| **Memoria de largo plazo** | Datos que el agente recuerda entre conversaciones (PostgresStore). |
| **Human-in-the-loop** | Pausar al agente (interrupt) para que una persona apruebe una acción antes de reanudar. |
| **Middleware del agente** | Lógica que corre antes/después de cada llamada al modelo o herramienta (límites, PII, reintentos, fallback). |
| **Inyección de prompt** | Instrucciones maliciosas en datos que el agente lee y que intentan desviar su conducta. |
| **Tríada letal** | Combinación peligrosa: acceso a datos privados + exposición a contenido no confiable + capacidad de comunicarse hacia fuera. |
| **Traza** | Registro de cada paso de una ejecución, con duración y costo (LangSmith). |
| **SAST / DAST** | Análisis estático del código (CodeQL) y dinámico de la app desplegada (OWASP ZAP). |
| **CI/CD** | Integración y despliegue continuos: el pipeline valida y publica cada cambio. |
| **Puerta de calidad (quality gate)** | Umbral en el pipeline que bloquea el merge si no se cumple. |
| **SLO** | Objetivo de nivel de servicio (ej. % de respuestas bajo X ms). |
| **Core Web Vitals** | Métricas de experiencia web (LCP, INP, CLS). |
| **Code freeze** | Congelamiento del código antes de una versión final. |

---

## 5. Dependencias entre sesiones

| Sesión | Requiere | Qué reutiliza |
|---|---|---|
| S1 | — | — |
| S2 | S1 | Harness básico para usar el agente en deep research y redacción |
| S3 | S2 | PRD, historias y criterios Given/When/Then |
| S4 | S3 (y S2) | Specs y criterios de aceptación → tests |
| S5 | S1, S4 | Piezas del harness (skills, MCP); código con tests para validar |
| S6 | S1, S4, S5 | Reglas de CLAUDE.md, historial de git, skills y CI |
| S7 | S3, S4 | Contratos de datos → migraciones; TDD para RLS |
| S8 | S7, S4 | Backend y datos de prueba; harness de tests |
| S9 | S7 | Base de datos, RLS y catálogo |
| S10 | S9, S5, S8 | Búsqueda semántica (S9), servidor MCP (S5), website (S8) |
| S11 | S10, S7 | Agente y base de datos para memoria |
| S12 | S10, S11, S6 | Agente completo; metodología de evals y juez de S6 |
| S13 | S12, S8, S6 | Controles del agente (S12), web desplegable, CI |
| S14 | S4, S6, S8, S12, S13 | Vitest, Playwright, evals del agente, guardarraíles, escaneos |
| S15 | Todas | Flujo completo PRD → spec → harness → código → pipeline |

```
S1 → S2 → S3 → S4 → S5 → S6
           │    │    │     │
           └→ S7 → S8      │
                │    │     │
                └→ S9 ─┐   │
          (S5) ───────→ S10 → S11 → S12 ←┘
                                    │
                         S13 → S14 → S15
```

---

## 6. Hilo conductor del proyecto

La salida de cada sesión es la entrada de la siguiente. Columnas: **Punto de partida · Qué se construye · Entregable de salida (y cómo verificarlo) · Conexión con lo siguiente**.

### Módulo 1 · Desarrollo con agentes de IA

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S1** Harness | Repo con `CONTEXT.md`; Claude Code instalado; cuenta de GitHub | CLAUDE.md inicial, primeras skills/hooks/subagentes, configuración MCP; misma tarea de TaskFlow AI con y sin harness; flujo ticket → PR | `CLAUDE.md` + `.claude/` versionados; comparativa documentada con/sin harness; 1 PR con plan, implementación y revisión automática. ✔ el PR existe y la revisión corrió | El harness se usa en todas las sesiones; las reglas se auditan en S6 |
| **S2** PRD y backlog | Harness funcionando | Investigación JTBD/competencia/pricing; PRD versionado; épicas, historias con Given/When/Then, RNF y tickets con prioridad y dependencias | `docs/prd/` versionado + backlog priorizado. ✔ cada historia tiene criterios G/W/T y cada ticket prioridad y dependencias | Historias → specs (S3); criterios → tests (S4); RNF → seguridad y SLOs (S13–S14) |
| **S3** SDD | PRD y backlog | Specs de historias: contexto, reglas, criterios; contratos de datos e interfaces; implementación de una historia; evolución de una spec | `specs/` con al menos una historia implementada que cumple su spec; criterio escrito de cuándo no usar SDD. ✔ el código satisface los criterios de la spec | Contratos → migraciones (S7); criterios → tests (S4) |

**Checkpoint Módulo 1**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S1 | Agente con harness; flujo ticket → PR | Producto definido |
| S2 | PRD y backlog como fuente de verdad | Specs y código |
| S3 | Primera historia implementada desde spec | Tests reales, gobierno del agente |

### Módulo 2 · Calidad y gobierno del agente de código

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S4** TDD y revisión | Specs + historia implementada | Tests unitarios e integración desde criterios (rojo primero), BD de prueba, harness que fuerza TDD, documentación viva, revisión adversarial | Suite Vitest en verde con cobertura real (sin falsa cobertura); docs/ADR en el PR; informe de revisión adversarial arbitrado. ✔ los tests fallan si se rompe el comportamiento | Vitest entra al pipeline (S14); el método se usa en S7–S8 |
| **S5** MCP y Skills | Harness + código con tests | Servidor MCP propio (assets públicos y mapa del sitio); Custom Skills con validadores; Skill de Tech Lead (a11y y SEO técnico); deuda técnica delegada | Servidor MCP funcionando y conectado; Skill de Tech Lead con reporte. ✔ el agente invoca el servidor y la skill produce hallazgos | El servidor MCP se vuelve herramienta del agente propio (S10) |
| **S6** Guardarraíles y evals | Reglas del harness, skills, historial de git | Auditoría de reglas vs. git; guardarraíles en CI; agente revisor en GitHub Actions; calibración de costo; evals con/sin harness, líneas base, varios ensayos, juez calibrado | Workflows de CI con guardarraíles; suite de evals del harness con resultados. ✔ un PR que viola una regla queda bloqueado | Metodología de evals → evaluación del agente (S12) y puertas del pipeline (S14) |

**Checkpoint Módulo 2**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S4 | TDD y documentación viva en cada PR | Extender el harness |
| S5 | Harness con MCP y skills propios | Medir si el harness sirve |
| S6 | Reglas medidas y convertidas en guardarraíles de CI | Producto real: backend y frontend |

### Módulo 3 · IA en el ciclo de desarrollo: backend y frontend

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S7** Backend | Contratos de datos (S3), TDD (S4), CI (S6) | App Next.js 16 (App Router); arquitectura por capas; migraciones SQL; inspección de esquema; RLS con pruebas; datos de prueba | `supabase/migrations/` aplicadas; capa de dominio separada; tests de RLS en verde; seed. ✔ un usuario no accede a filas ajenas | La BD sostiene frontend (S8), RAG (S9) y memoria (S11) |
| **S8** Frontend | Backend con datos de prueba | Wireframe → React (Claude Vision, Tailwind, Shadcn/UI); catálogo de componentes; tokens y design system con historias; conexión a datos con estados de carga; E2E con Playwright | UI conectada sin errores silenciosos; design system documentado; E2E en verde antes del push. ✔ Playwright pasa los flujos principales | El website aloja el chat del agente (S10); Playwright entra al pipeline (S14) |

**Checkpoint Módulo 3**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S7 | Backend con RLS, migraciones y datos de prueba | Interfaz |
| S8 | App completa con UI, design system y E2E | IA dentro del producto |

### Módulo 4 · Creación de productos con IA: RAG y agente propio

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S9** RAG | BD con RLS y catálogo | Embeddings; columnas vectoriales con pgvector, índices y chunking; búsqueda semántica con filtros RLS; indexación automática | Función de búsqueda semántica respetando RLS; indexación al crear ítems. ✔ consultas devuelven ítems relevantes y solo los permitidos | La búsqueda es herramienta del agente (S10) |
| **S10** Agente | Búsqueda (S9), servidor MCP (S5), website (S8) | Chat embebido con streaming; bucle del agente con createAgent y con StateGraph; herramientas con Zod; anti-alucinación; cambio de modelo con initChatModel | Agente en el website que usa búsqueda y MCP; prueba de cambio de modelo. ✔ responde solo con datos de sus herramientas | Base para memoria y aprobación (S11) |
| **S11** Memoria | Agente funcionando + BD | Memoria de conversación (PostgresSaver, thread_id); memoria de largo plazo (PostgresStore); middleware de resumen; aprobación humana con interrupt(); análisis de Deep Agents | Agente con memoria persistente y flujo de aprobación en la UI. ✔ retoma una conversación y pausa ante acciones sensibles | Superficie a controlar y evaluar (S12) |
| **S12** Controles y evals | Agente con memoria; método de evals (S6) | Middleware propio; controles (límite de llamadas, PII, reintentos, fallback); defensas ante inyección; trazas LangSmith; dataset de 20 casos + juez con rúbrica; poda del harness | Middleware y controles activos; trazas; suite de evals del agente con resultados. ✔ los 20 casos se ejecutan y se reporta puntaje | Controles → reporte de seguridad (S13); evals → puerta del pipeline (S14) |

**Checkpoint Módulo 4**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S9 | Conocimiento propio buscable con RLS | Agente que lo use |
| S10 | Agente con herramientas en el website | Memoria y control humano |
| S11 | Agente con memoria y aprobación humana | Controles, trazas y evaluación |
| S12 | Agente controlado, trazado y evaluado | Seguridad integral y producción |

### Módulo 5 · DevSecOps: seguridad, despliegue y observabilidad

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S13** Seguridad | Producto + agente con controles | Gestión de secretos; CodeQL, Dependabot, escaneo de secretos; OWASP ZAP; límites de alcance del agente; detección de instrucciones maliciosas; integración de controles de S12 | Reporte de seguridad del producto y del agente. ✔ sin secretos expuestos; hallazgos clasificados y con remediación | Los escaneos entran como puertas del pipeline (S14) |
| **S14** CI/CD y observabilidad | Tests, E2E, evals, escaneos | Despliegue continuo con vistas previas por rama; config y migraciones como código; pipeline (lint, Vitest, Playwright, evals); bloqueo de merges; instrumentación, SLOs, alertas; Core Web Vitals; E2E programado; tableros | Pipeline completo con puertas; tablero técnico, del agente y de negocio. ✔ un PR que baja calidad o seguridad no se puede mergear | Pipeline y tablero se ponen a prueba en S15 |

**Checkpoint Módulo 5**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S13 | Reporte de seguridad y escaneos | Automatizar en pipeline |
| S14 | Producto en producción con pipeline y observabilidad | Ensayo integral bajo presión |

### Módulo 6 · Pipeline completo y Demo Day

| Sesión | Punto de partida | Qué se construye | Entregable de salida / verificación | Conexión |
|---|---|---|---|---|
| **S15** War Room | Todo el sistema en producción | Repaso del flujo; casos límite y depuración; funcionalidad urgente de spec a producción; incidente simulado detectado por evals/guardarraíles; code freeze | Funcionalidad nueva en producción vía pipeline; postmortem del incidente; versión final etiquetada. ✔ el incidente se detectó automáticamente | Versión final para la sesión restante del módulo (abierta) |
| **S16?** | Abierta: estudio por cuenta propia | Abierta | Abierta | — |

**Checkpoint Módulo 6**

| Sesión | Qué funciona ya | Qué falta |
|---|---|---|
| S15 | Flujo completo probado bajo presión; versión final | Sesión restante abierta (estudio por cuenta propia) |

### Resumen por módulo

- **M1:** Entra con un repo vacío y Claude Code → sale con harness, PRD, backlog y la primera historia implementada desde spec.
- **M2:** Entra con código guiado por specs → sale con TDD, MCP y skills propios, y reglas medidas convertidas en guardarraíles de CI.
- **M3:** Entra con contratos y guardarraíles → sale con app Next.js completa (backend con RLS, UI con design system y E2E).
- **M4:** Entra con una app sin IA → sale con RAG y un agente propio con memoria, aprobación humana, controles y evals.
- **M5:** Entra con un producto funcional local → sale con reporte de seguridad, pipeline con puertas y observabilidad en producción.
- **M6:** Entra con el sistema en producción → sale con una versión final probada bajo un incidente simulado.

---

## 7. Estructura del repositorio

### Actual (solo lo que existe)

```
Agentic-Engineer/        (rama main)
└── CONTEXT.md
```

### Estrategia de ramas (una rama por sesión)

Cada sesión vive en su propia rama, que queda como foto del estado del proyecto al cerrar esa sesión.

| Rama | Propósito |
|---|---|
| `main` | Estado más reciente y estable. Recibe cada sesión cerrada mediante PR. |
| `sesion-NN-slug` | Trabajo de la sesión N (ej. `sesion-01-harness`, `sesion-02-prd`). Se crea desde `main` al iniciar la sesión. |

Flujo por sesión:
1. Al iniciar: `git switch main && git pull && git switch -c sesion-NN-slug`.
2. Durante: commits pequeños en la rama de la sesión.
3. Al cerrar: actualizar `CONTEXT.md` en la rama, abrir PR `sesion-NN-slug → main` y hacer merge **sin borrar la rama**, para conservar la foto de esa sesión.

Ramas previstas: `sesion-01-harness`, `sesion-02-prd`, `sesion-03-sdd`, `sesion-04-tdd`, `sesion-05-mcp-skills`, `sesion-06-guardarrailes-evals`, `sesion-07-backend`, `sesion-08-frontend`, `sesion-09-rag`, `sesion-10-agente`, `sesion-11-memoria`, `sesion-12-controles-evals`, `sesion-13-seguridad`, `sesion-14-cicd-observabilidad`, `sesion-15-war-room`.

### Objetivo (referencia, se irá construyendo)

```
Agentic-Engineer/
├── CONTEXT.md
├── README.md
├── CLAUDE.md
├── .claude/
│   ├── settings.json          # hooks, permisos            (S1)
│   ├── agents/                # subagentes                 (S1, S4)
│   └── skills/                # skills propias, Tech Lead  (S1, S5)
├── .mcp.json                  # servidores MCP             (S1, S5)
├── .github/
│   ├── workflows/             # CI, revisor, pipeline      (S6, S13, S14)
│   └── dependabot.yml         #                            (S13)
├── docs/
│   ├── research/              # JTBD, competencia, pricing (S2)
│   ├── prd/                   # PRD versionado             (S2)
│   ├── backlog/               # épicas, historias, tickets (S2)
│   ├── adr/                   # decisiones de arquitectura (S4)
│   ├── diagrams/              #                            (S4)
│   ├── security/              # reporte de seguridad       (S13)
│   └── lessons/               # notas por lección
├── specs/                     # specs y contratos          (S3)
├── src/
│   ├── app/                   # Next.js App Router         (S7, S8)
│   ├── domain/                # lógica de negocio          (S7)
│   ├── data/                  # acceso a datos             (S7)
│   ├── components/            # design system              (S8)
│   ├── rag/                   # embeddings e indexación    (S9)
│   └── agent/                 # bucle, tools, memoria, middleware (S10–S12)
├── mcp-server/                # servidor MCP propio        (S5)
├── supabase/
│   ├── migrations/            #                            (S7, S9, S11)
│   └── seed/                  #                            (S7)
├── tests/
│   ├── unit/                  # Vitest                     (S4)
│   ├── integration/           #                            (S4, S7)
│   └── e2e/                   # Playwright                 (S8, S14)
└── evals/
    ├── harness/               # evals del harness          (S6)
    └── agent/                 # dataset de 20 casos + juez (S12)
```

---

## 8. Bitácora de lecciones

> De la más reciente a la más antigua. Añadir entradas arriba; nunca reescribir las anteriores.

_Sin entradas todavía._

### Plantilla

```markdown
### AAAA-MM-DD · Sesión N — Título
- **Agregado al repositorio:** …
- **Decisiones tomadas:** … (y por qué)
- **Dudas pendientes:** …
- **Aprendizajes clave:** …
- **Entregable verificado:** sí / no — cómo se verificó
```

---

## 9. Stack y herramientas

Estado: ⬜ no instalado · 🟡 instalado sin configurar · ✅ instalado y configurado en el repo. Herramientas tal como aparecen en el temario.

| Categoría | Herramienta | Sesión | Estado |
|---|---|---|---|
| Agente de código | Claude Code (CLAUDE.md, skills, hooks, subagentes, plan mode) | S1 | ⬜ |
| Protocolos | Model Context Protocol (MCP) | S1, S5, S10 | ⬜ |
| Control de versiones / CI | Git, GitHub, GitHub Actions | S1, S6, S14 | ⬜ |
| Testing | Vitest | S4 | ⬜ |
| Testing | Playwright | S8, S14 | ⬜ |
| Framework web | Next.js 16 (App Router), React | S7, S8 | ⬜ |
| UI | Tailwind, Shadcn/UI | S8 | ⬜ |
| UI | Herramienta de historias para el design system (ej. Storybook) — *sugerido, el temario no la nombra* | S8 | ⬜ |
| Visión | Claude Vision | S8 | ⬜ |
| Backend / BD | Supabase (PostgreSQL, RLS) | S7 | ⬜ |
| Vectores | pgvector | S9 | ⬜ |
| Embeddings | Voyage AI | S9 | ⬜ |
| Agentes | createAgent, StateGraph, initChatModel, PostgresSaver, PostgresStore, interrupt(), createMiddleware, Deep Agents (APIs del ecosistema LangChain/LangGraph — *inferido*) | S10–S12 | ⬜ |
| Esquemas | Zod | S10 | ⬜ |
| Modelos | Claude Sonnet, Grok u otros | S10 | ⬜ |
| Observabilidad agente | LangSmith | S12 | ⬜ |
| Seguridad | CodeQL, Dependabot, escaneo de secretos | S13 | ⬜ |
| Seguridad | OWASP ZAP | S13 | ⬜ |
| Despliegue | Vercel (vistas previas por rama) | S14 | ⬜ |
| Observabilidad | Trazas, SLOs, alertas, Core Web Vitals | S14 | ⬜ |

---

## 10. Prerrequisitos

> Adaptado a perfil full-stack senior: se da por dominado lo general (TypeScript, React, Node, Git, HTTP, testing básico). El repaso se concentra en lo específico del temario. Cada bloque es un repaso corto (≤1 h), no un curso.

**Antes de la Sesión 1 (imprescindible)**
- **Conceptos de LLM aplicados:** tokens, ventana de contexto y su degradación, tool use, costo por token.
- **Claude Code instalado y probado:** sesión básica, permisos, lectura de un repo pequeño.

**Antes de cada bloque (repaso puntual)**

| Antes de | Repasar | Por qué |
|---|---|---|
| S2 | JTBD y formato de historias Given/When/Then | Base del PRD y del backlog |
| S4 | Vitest (si vienes de Jest), mutation testing a nivel conceptual | Detectar falsa cobertura |
| S5 | Especificación de MCP: tools, resources, transportes | Construir un servidor propio |
| S7 | Novedades de Next.js 16 (App Router, Server/Client Components); políticas RLS en PostgreSQL | Backend de la sesión |
| S9 | Embeddings, similitud coseno, índices vectoriales (HNSW/IVFFlat) | RAG con pgvector |
| S10 | Modelo de LangGraph: grafo, estado, nodos, aristas | Bucle del agente con StateGraph |
| S12–S13 | OWASP Top 10 para aplicaciones con LLM; prompt injection | Controles y reporte de seguridad |
| S14 | SLOs/SLIs, Core Web Vitals | Observabilidad y puertas del pipeline |

---

## 11. Convenciones para el agente

1. **Leer primero** este `CONTEXT.md` y confirmar el punto de partida de la lección antes de proponer nada.
2. **Explicar antes de generar código:** qué se hará, por qué y cómo se conecta con el temario.
3. **Paso a paso:** proponer un paso, esperar mi confirmación, ejecutarlo; no avanzar sin "ok".
4. **Solo la lección actual:** no construir ni adelantar contenido de sesiones futuras; si algo lo requeriría, avisar y dejarlo anotado.
5. **Proponer ejercicios** cortos por tema para que yo practique antes de que el agente resuelva.
6. **Sin inventar temario:** cualquier extra se marca como *sugerido*.
7. **Verificar el entregable** contra la sección [Hilo conductor](#6-hilo-conductor-del-proyecto) antes de cerrar.
8. **Actualizar este documento al cierre:** estado actual, casilla de progreso, estructura del repo, stack y nueva entrada de bitácora; mostrar el diff antes de darlo por bueno.
9. **Conservar la bitácora:** solo se agregan entradas, nunca se reescriben.
10. **Idioma:** español; Markdown limpio.
11. **Una rama por sesión:** trabajar siempre en `sesion-NN-slug`, nunca directo en `main`; cerrar con PR a `main` sin borrar la rama (ver [Estrategia de ramas](#estrategia-de-ramas-una-rama-por-sesión)).
12. **Ritmo:** ~4.5 h por sesión. Si una sesión excede su tiempo, proponer qué recortar (marcado como *opcional*) en lugar de alargarla.
