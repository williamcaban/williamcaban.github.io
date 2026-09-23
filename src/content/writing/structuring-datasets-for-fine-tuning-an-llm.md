---
title: "Structuring Datasets for Fine-Tuning an LLM"
date: 2024-06-29T02:24:56.728Z
description: "Creating your Dataset"
originalUrl: "https://medium.com/@william.caban/structuring-datasets-for-fine-tuning-an-llm-8ca15062dd5c"
---

![Photo by Joshua Sortino on Unsplash](/assets/writing/structuring-datasets-for-fine-tuning-an-llm/image-1.jpg)

*Photo by Joshua Sortino on Unsplash*

## Creating your Dataset

In the blog [A Journey Through the LLM Fine-tuning Landscape](/writing/a-journey-through-the-llm-fine-tuning-landscape), I covered five standard techniques for fine-tuning a large language model (LLM). By now, you should know which combination of techniques you want to use. The next step is formatting or structuring your proprietary or unique information in the training dataset for the corresponding technique. How do you prepare your training dataset? Which fields should it include? What structure to follow?

As you might have guessed by now, “it depends” on your use case and the combination of techniques you want to use.

Before discussing the structure of datasets used for fine-tuning LLMs, let’s explore the characteristics of a good dataset.

## Characteristics of a Good Dataset

The success and performance resulting from a fine-tuned model are directly tied to the quality of the training dataset. Ensuring you have a dataset with high-quality data is done by following well-known and established good practices from statistics, data science, and machine learning. Among what I consider the most important ones are the techniques for ensuring the dataset has good coverage of information for the intended use case and that the sample composition is representative of the real-world mix the model will find in production.

## Data Relevance & Diversity

- The dataset should be formed from highly relevant samples that resemble the contexts and tasks for your use case.
- It should also be representative of the data the model will encounter in production
- The dataset should contain samples that cover the full scope of the task or domain of your use case.
- Incomplete coverage of the scope of your use case will result in a biased and inaccurate model
- When fine-tuning a classification task, ensure a balanced distribution of different classes or categories to prevent bias.
- When fine-tuning for prediction tasks, ensure a combination of recent and historical data

## Data Cleaning & Accuracy

- Remove duplicate documents
- Exhaustive audit and clean the dataset
- Correct inaccuracies, address missing values and remove irrelevant information.

## Choosing the Type Model to Fine-Tune

Before creating a dataset, the capabilities of the model you plan to fine-tune will determine the type of composition the dataset will need: a base or foundation LLM, an instruct LLM, a chat LLM, or another type.

![(Image by author)](/assets/writing/structuring-datasets-for-fine-tuning-an-llm/image-2.png)

*(Image by author)*

I will focus on base, instruct, and chat models for this blog.

When using **a base or foundation model,** the model has capabilities like:

- Understanding of a language (or languages) with grammar, syntax, semantics, and linguistic patterns
- General knowledge acquired from a vast amount of information on many topics the model has seen during training
- Contextual understanding to interpret and generate text based on context
- Ability to identify and replicate patterns
- Ability to draw connections between different fields of knowledge
- A certain level of analogical reasoning

A common expectation is that **a base or foundational model is not intended for general purposes.** This type of model requires fine-tuning. A base model tries to predict tokens generating words based on its understanding of a language. This is one of the reasons many base models struggle to stop generating tokens or go into repeating the same strings over and over until the maximum number of output tokens is exhausted.

When using an **instruct fine-tuned LLM,** the model has additional capabilities over the base model:

- The model has improved its ability to interpret and follow natural language instructions, allowing for a better understanding of user prompts and queries
- The model becomes better in understanding the context of instructions and generating responses
- Furthermore, if the instruct model was fine-tuned with a [Direct Preference Optimization (DPO)](https://arxiv.org/pdf/2305.18290) technique, the model learns to adjust the tone, style, and level of details

When using a **chat fine-tuned LLM**, the model has additional capabilities over the base model, including:

- The model develops the ability to maintain coherent and natural dialogue across multiple turns of conversations
- The model can maintain context throughout and extended interactions
- The model becomes proficient in conversational tasks like answering questions, providing explanations, or offering assistance on particular topics
- The model can adapt to a persona, adjusting its tone, style, and personality to match the specific chat persona
- Ability to better handle misunderstandings or provide clarifications

## Creating the datasets

The dataset structure required for fine-tuning an LLM consists of input-output pairs demonstrating the desired behavior for the specific task. You can create a dataset for a single fine-tuning technique or one that is reusable across many fine-tuning techniques.

## Instruction Fine-tuning

The dataset for instruction tuning of an LLM must contain instructions paired with the desired responses. These instruction-response pairs will teach the model to follow human directions. These datasets should contain text for a “system” prompt (not all the models recognize the concept of a “system” prompt), with examples of “instructions”, the “input” with an example of the type of input expected with those “instructions”, and the “output” with the expected answer.

Take a look at the [instructions dataset from Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca). You will notice the “instruction” (yellow), “input” (orange), “output” (green), and “text” (red) fields. In this particular example, the “instruction” column contains examples of user queries with instructions. If the user query involves interpreting certain information, that additional information is in the “input” column. The “output” column teaches the LLM the expected type of reply expected from the prompt. Finally, the “text” field represents the rendered prompt with system instructions containing the user “instructions” and “input”.

![(Image by author)](/assets/writing/structuring-datasets-for-fine-tuning-an-llm/image-3.png)

*(Image by author)*

If you want more details about the format of an entry in this dataset, check their HuggingFace [datacard](https://huggingface.co/datasets/tatsu-lab/alpaca#data-instances).

Another example of an instruction fine-tuning dataset is the [mermaid-flowchart-transformer](https://huggingface.co/datasets/rakitha/mermaid-flowchart-transformer), which is intended to fine-tune a multi-modal LLM to explain or generate a [Mermaid](https://mermaid.js.org/) diagram. There is a derived dataset [mdermaid-flowchart-transformer-moondream-caption](https://huggingface.co/datasets/sroecker/mermaid-flowchart-transformer-moondream-caption), which expands it and makes it suitable for teaching a system to create captions for Mermaid diagrams or to generate a Mermaid diagram (text or image) from a caption.

![(Image by author)](/assets/writing/structuring-datasets-for-fine-tuning-an-llm/image-4.png)

*(Image by author)*

What you may notice from this dataset is that the “messages” column contains information for expected interaction between the “roles” of “user” and “assistant”. This dataset can also be used to fine-tune a chat text model, or chat multi-modal model to generate and interpret Mermaid diagrams. Whatever applies to the use case.

## Prompt Tuning

The format of a dataset for prompt tuning an LLM consists of input-output pairs with the following characteristics:

- Each example in the dataset should contain an input prompt and the corresponding desired output.

The input prompt follows a template or format that informs the model what to do. For example, the Alpaca prompt template contains “Instructions”, “Input” and a “Response” sections.

```bash
### Instruction:
(Instruction Text)

### Input:
(Auxiliary Input Text)

### Response:
(Desired Response Text)
```

- The input prompt must include clear and specific instructions that guide the model on what task to perform.
- The input prompt is a rendered prompt template containing instructions, a task description, and any auxiliary input required.
- Unlike other fine-tuning techniques, which focus on a single task or domain, the dataset for Prompt Tuning should cover a wide range of tasks or domains.

While the Prompt Tuning technique is efficient, one drawback to remembering and working with it is the [lack of interpretability](https://medium.com/@DrShivSidana/how-prompt-tuning-transforms-llms-377d402000d3#:~:text=These%20prompts%20are%20highly%20effective,optimised%20performance%20are%20often%20opaque.) it results in. The IBM Research article [What is prompt-tuning?](https://research.ibm.com/blog/what-is-ai-prompt-tuning#:~:text=One%20drawback%20of%20prompt-tuning%20is%20its%20lack%20of%20interpretability.) goes into details of additional optimizations.

## Sequential Fine-tuning

Sequential fine-tuning is the process of gradually adapting a model to a more specialized task by using multiple datasets in a specific order. This involves starting with more general tasks and then fine-tuning the model with datasets more specific to the particular use case. It is important to note that sequential fine-tuning is about the order in which the model is further fine-tuned, rather than the specific format of the dataset.

![(Image by author)](/assets/writing/structuring-datasets-for-fine-tuning-an-llm/image-5.png)

*(Image by author)*

## Closing Remarks

You might notice that there are common patterns among the dataset formats. Understanding the proper dataset formats for fine-tuning LLMs is crucial for achieving optimal results. Whether you’re using instruction-based formats, prompt-completion pairs, or sequential fine-tuning approaches, the key is to ensure your data is well-structured, diverse, and relevant to your target task.

As you embark on your fine-tuning journey, I encourage you to explore the wealth of d[atasets available on Hugging Face](https://huggingface.co/datasets). You will find a wide variety of high-quality, curated datasets specifically designed for fine-tuning language models. By examining these datasets, you will discover both exemplary and bad examples, allowing you to gain valuable insights for developing an effective formatting technique that suits your specific use case.

Remember, the quality and format of your dataset play a crucial role in the success of your fine-tuned model. Take the time to clean your data; that is the most critical step. Explore and learn from the open datasets if you want to learn how others format their data for different use cases.
