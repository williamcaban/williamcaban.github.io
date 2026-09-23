---
title: "Scorers, Graders, and Evaluation Tasks: A Practitioner’s Map"
date: 2026-04-26T19:56:00.699Z
description: "There is a terminology problem in AI evaluation that slows down almost every team building with large language models. “Scorer” and…"
originalUrl: "https://medium.com/@william.caban/scorers-graders-and-evaluation-tasks-a-practitioners-map-1fd996c1e418"
---

![AI Practitioner’s Map to Scorers, Graders and Evaluation Tasks](/assets/writing/scorers-graders-and-evaluation-tasks-a-practitioner-s-map/image-1.png)

*AI Practitioner’s Map to Scorers, Graders and Evaluation Tasks*

There is a terminology problem in AI evaluation that slows down almost every team building with large language models. “Scorer” and “grader” get used interchangeably — even in major frameworks — when they describe functionally different things. “Evaluation task” gets conflated with “test case.” And the algorithm that measures something gets confused with the methodology for deciding what to measure in the first place.

This confusion is not cosmetic. It is the difference between having a hammer and knowing what you are building. When your team cannot agree on what an evaluation actually *is*, you end up with inconsistent practices across projects, non-reproducible results, and measurement gaps that surface in production at the worst possible moment.

Let’s fix the terminology.

---

## Four Concepts, One Clear Map

Modern AI evaluation practice uses four distinct concepts that compose into each other:

[View this snippet on GitHub Gist](https://gist.github.com/williamcaban/61dbf9177e68a8f52e0a899bb6c03da0)

These are not synonyms. They are layers. **Scorers** and **graders** compose into **tasks**. **Tasks** compose into **suites**. Confusing them is like confusing a function, an algorithm, and an application — each level of abstraction serves a different purpose.

## Scorers: Precise, Deterministic Measurement

A **scorer** computes a specific, bounded measurement of a model’s output against a defined target. **It answers one narrow question with a number or a pass/fail result:** “Does this response match the reference exactly?” or “What is the F1 overlap between this answer and the gold standard?”

Scorers are characterized by what they do *not* do: they do not interpret, they do not explain, and they do not apply qualitative judgment. That is their strength. AISI’s Inspect framework defines its simple scorer types as answer extraction (isolating a specific response using heuristics), text similarity (comparing model output against a target string), and format validation (checking structural correctness). All deterministic, algorithmic operations.

**When to use a scorer:**

- You have a defined ground truth to compare against
- Correctness is unambiguous (the capital of France is Paris, not approximately Paris)
- You need speed, reproducibility, and zero variance between runs
- You are running regression evaluation at scale where human-level judgment is not required

**Common scorer types:**

- *Exact match* — binary correctness for closed-domain answers
- *F1 / token overlap* — partial credit for extractive tasks
- *Text similarity* (BERTScore, ROUGE) — semantic proximity to a reference
- *Format validation* — checks that output conforms to a required structure (JSON schema, code syntax)
- *Tool call verification* — checks that the agent invoked the right tools with the right parameters

**The weakness of scorers: their fragility against valid variation.** A model or an agent that produces the right answer phrased differently can fail an exact matcher that was never designed to handle paraphrases. **This is not a bug — it is the boundary of what scorers are designed to do.** When you need to handle that boundary, you need a grader.

## Graders: Rubric-Based, Explanatory Evaluation

A **grader** evaluates a model’s output against a rubric using qualitative judgment, and returns both a score *and* an explanation of that score. Where a scorer asks “does this match?”, **a grader asks “how well does this satisfy the criteria, and why?”**

AISI’s Inspect framework illustrates the distinction concretely. Its `model_graded_qa()` and `model_graded_fact()` functions behave fundamentally differently from its simple scorers. They use a separate LLM to assess whether the model's completion "satisfies a description of the ideal answer" — a judgment call, not a lookup. They support custom rubric templates with variables like `{criterion}`, `{question}`, and `{answer}`. And they return a `Score` object that includes an `explanation` field containing the grader model's full reasoning. **A scorer returns a value. A grader returns a value *and tells you why*.**

Anthropic’s evaluation framework uses “grader” as its umbrella term for all evaluation logic and subdivides by type: **code-based graders** (deterministic, fast — what this post calls scorers) versus **model-based graders** (LLM-powered, rubric-driven — **what this post calls graders**). OpenAI’s evals API reflects the same functional split: `StringCheckGrader` and `TextSimilarityGrader` **behave like scorers**; `LabelModelGrader` and `ScoreModelGrader` **use LLMs with configurable rubrics and return reasoning alongside scores. The naming convention varies across frameworks; the functional distinction is consistent.**

**When to use a grader:**

- The output is open-ended and has no single correct answer
- You need to assess multiple qualitative dimensions simultaneously (coherence, faithfulness, helpfulness, safety)
- You want an actionable explanation alongside the score — not just whether the model passed, but why it failed
- Human-like judgment is required, and you cannot enumerate all valid responses in advance

**Common grader types:**

- *LLM-as-a-Judge (LLMaJ)* — a capable model applies a rubric to score another model’s output
- *Rubric-based scoring* — structured criteria with defined dimensions, weights, and pass thresholds
- *Pairwise comparison* — two outputs ranked against each other rather than against an absolute standard
- *Natural language assertion* — a free-form claim about the output evaluated by a judge model

**The prerequisite graders require that scorers do not:** calibration. **An uncalibrated judge model introduces systematic bias** that is harder to detect than a broken regular expression, precisely because it produces outputs that *look* reasonable. Before relying on a grader in a quality gate, validate it against human-labeled examples to confirm it measures what you think it does.

**Human graders** — expert review, spot-checking, A/B preference evaluation — remain the gold standard for calibration. Use them to validate your model-based graders, not as your primary evaluation loop.

## The Practical Difference

The distinction matters because teams regularly reach for one when they need the other.

**Scorers excel when:**

- High volume, time-sensitive evaluation (regression suites running on every PR)
- Well-defined task domains with verifiable ground truth
- Automated, fully deterministic pipelines where variance is unacceptable

**Graders excel when:**

- Open-ended generation tasks (summarization, Q&A, instruction following)
- Multi-dimensional quality assessment (coherence *and* faithfulness *and* helpfulness)
- Debugging: a grader’s explanation tells you *why* a model failed, not just that it did
- Formative evaluation during development, where feedback matters more than throughput

**A well-designed evaluation task for most production AI systems uses both.** A scorer to verify that citations are traceable. A grader to assess whether the response is actually useful. Choosing one when you need the other is a category error, not a tradeoff.

## Evaluation Tasks: Where Methodology Lives

An **evaluation task** is a complete, self-contained assessment procedure. It bundles together:

- **Inputs** — the prompts, contexts, or scenarios presented to the model
- **Success criteria** — what “good” looks like, defined before you run anything
- **One or more scorers and/or graders** — the evaluation logic applied to measure against those criteria
- **Reference solutions** — expected outputs, or at minimum a proof that the task is solvable by a correct system

Anthropic’s definition is precise: **a task is “a single test with defined inputs and success criteria.”** But the phrase “defined success criteria” carries significant weight. **It is what separates a reproducible evaluation task from an ad-hoc test run.**

Consider the difference between these two things:

- “We ran BERTScore on our RAG pipeline outputs.”
- “We ran a hallucination detection task: 200 queries sampled from real user traffic, assessed against a two-component protocol — citation traceability via code-based scorer, semantic faithfulness via calibrated LLM grader — with a task-level pass requiring both to agree above defined thresholds, balanced to include both faithful and unfaithful examples to prevent one-sided optimization.”

**The first has a scorer. The second has an evaluation task.** Only the second is reproducible, auditable, and designed to actually catch the failure mode you care about.

**A well-designed evaluation task has four properties:**

- **Reproducible** — any practitioner running it against the same model gets comparable results
- **Balanced** — it tests both the cases where a behavior should occur and the cases where it should not, preventing optimization against a one-sided dataset
- **Passable** — a correct system can pass it; there is a reference solution proving the task is solvable
- **Documented** — its design choices are explicit and traceable, not tribal knowledge that leaves when an engineer does

Most teams have scorers and graders. Very few have proper evaluation tasks. They have scripts that call scorers, but those scripts are not documented, not validated for reproducibility, and not designed for reuse across models or teams. **The result is evaluation debt: a growing pile of ad-hoc measurement logic that produces numbers nobody fully trusts.**

## A Note on Agent Evaluation

The scorer/grader distinction sharpens when you evaluate agents rather than single model responses.

For agents operating across multiple steps — calling tools, modifying state, reasoning across turns — you are not just evaluating a final output. You are evaluating a trajectory. Anthropic’s evaluation framework distinguishes between:

- **Transcript/trace** — the complete record of tool calls, intermediate reasoning, and outputs across the agent’s run
- **Outcome** — the final environmental state, independent of the transcript (did the reservation actually get made? Is the file actually written?)

This matters for component selection. **Scorers work well against outcomes: binary checks on the final state. Graders are better suited for traces: assessing whether the agent’s reasoning path was coherent, safe, and aligned with intent, even when the final outcome was correct.**

Anthropic’s guidance: “Grade what the agent produced, not the path it took” — unless the path itself is what you are evaluating. That distinction has to be made at the task design level. A scorer or grader operates on a specific artifact. An evaluation task defines *which* artifact each component sees.

## Why Conflation Is Costly

**When scorers and graders are flattened into a single concept, a specific failure mode emerges: teams apply a scorer to a problem that requires a grader, observe high pass rates, and mistake measurement precision for evaluation coverage.**

A scorer that checks citation presence in a RAG response tells you whether citations appeared. A grader assessing faithfulness tells you whether the claims are actually supported by those citations. **Both are needed.** Using only a scorer makes your evaluation fast and reproducible — and blind to the failure mode that matters most.

The deeper pattern: **metric-to-methodology collapse**. A team picks a metric (say, BLEU score for summarization), runs it, and calls it their evaluation. **They have a scorer. They do not have an evaluation task.** When a new model version improves BLEU but degrades usefulness, the evaluation does not catch it — because it was never designed to measure usefulness.

The toolbox-versus-blueprint analogy holds: **scorers and graders are tools. Evaluation tasks are blueprints.** A team evaluating a RAG system for medical use cases needs a blueprint — a defined methodology specifying what to measure, which tools to apply to which artifacts, what thresholds define acceptable performance, and how the overall task was validated. The tools are available everywhere. The blueprint is where the value lives.

## How They Compose: A Concrete Example

You are evaluating a RAG pipeline for faithfulness in a customer support application.

**Step 1 — Define the evaluation task.** The task specifies: test 200 queries sampled from real support traffic; assess each response against two components; require both components to agree for a task-level pass; and balance the dataset to include both faithful and unfaithful examples.

**Step 2 — Select a scorer for citation traceability.** Code-based: extract citation references from the response and match against retrieved chunk IDs. Fast, deterministic, returns pass/fail per response. Catches responses that fabricate sources outright.

**Step 3 — Select and configure a grader for semantic faithfulness.** Model-based: LLMaJ with a faithfulness rubric — “does the response introduce claims absent from the retrieved context?” — calibrated against 50 human-labeled examples, returning a score plus an explanation of which specific claims were ungrounded. Catches subtle hallucinations that the scorer cannot see.

**Step 4 — Place the task in a suite.** Faithfulness is one of four tasks: relevance, completeness, safety, and faithfulness. The suite defines which tasks apply to this deployment, in what order, and what composite threshold governs your quality gate.

The scorer in step 2 runs in milliseconds and incurs no cost. The grader in step 3 adds latency and cost. The task design in steps 1 and 4 is where the real work lives — and the resulting methodology is reusable across every model version you evaluate against it.

## Practical Implications

**Match the component to the question.** If correctness is verifiable, use a scorer. If quality requires judgment, use a grader. If you need both — which is common — design an evaluation task that applies each to the appropriate artifact.

**Invest in task design, not just component selection.** Adding another scorer or grader takes an afternoon. Designing a balanced, reproducible evaluation task that actually catches the failure mode you care about is a multi-day exercise — and it compounds in value.

**Separate component evolution from task stability.** You can swap a weaker LLM judge for a stronger one, or update a rubric, without invalidating the task. When components and tasks are conflated, every update breaks historical comparisons.

**Resist metric-to-methodology collapse.** When someone asks “how are you evaluating X?”, the answer should name an evaluation task, not a metric. A metric is an output. A task is the procedure used to produce it, including the choice of scorers, graders, thresholds, and dataset balance.

**Build on validated tasks where possible.** Teams that start from pre-designed, domain-specific evaluation tasks — rather than individual scorers or graders — see faster onboarding and more consistent results across model versions. This is where evaluation platforms add their real value: not in the components themselves, but in curated, validated methodologies that teams do not have to design from scratch every time.

## Going Deeper

- [AISI Inspect Scorers Documentation](https://inspect.aisi.org.uk/scorers.html) — the clearest framework-level treatment of the scorer/model-graded scorer distinction, with concrete examples of rubric customization and explanation output
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic Engineering’s grader taxonomy, agent trajectory evaluation, and pass@k / pass^k metrics for reliability assessment
- [EvalHub](https://eval-hub.github.io/) — Red Hat’s framework-agnostic unified AI evaluation control plane, including Evaluation Collections: expert-curated, domain-specific evaluation task suites so teams know what to measure, not just how to measure it
- [LM Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness) — a strong library of pre-built evaluation tasks for standard language model benchmarks
- [RAGAS](https://docs.ragas.io/) — evaluation tasks specifically designed for RAG pipeline assessment (faithfulness, context precision, answer relevance), composable with standard scorer and grader libraries
