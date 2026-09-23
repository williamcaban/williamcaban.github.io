---
title: "A Journey Through the LLM Fine-Tuning Landscape"
date: 2024-06-25T04:24:16.697Z
description: "The Beginning"
originalUrl: "https://medium.com/@william.caban/a-journey-through-the-llm-fine-tuning-landscape-67df7939871f"
---

![Photo by Clay Banks on Unsplash](/assets/writing/a-journey-through-the-llm-fine-tuning-landscape/image-1.jpg)

*Photo by Clay Banks on Unsplash*

## The Beginning

You have jumped into creating the first proof-of-concept (POC) of a GenAI-enabled application with Retrieval-Augmented Generation (RAG). You built it and demoed it to your executives or investors. The project was approved, and you will get the funding. Now, you are ready to productize your POC. Quickly, you start noticing some limitations. Even with the promises of enormous context windows from the multiple LLM providers, it works differently than expected. The models must gain background expertise to interpret the retrieved proprietary data correctly. After many months of working with vector databases and RAG techniques, you have hit a wall. You are looking for alternatives to unblock your project. You are curious about what it will take to fine-tune an LLM to make it learn your domain-specific expertise. Well, you’re in the right place! You are not alone. I see this in my day job, on startups I mentor, and from friends who call me for advice.

Once you start reading about fine-tuning LLMs, you quickly uncover a jungle of terms, techniques, excitements, promises, and innovations. Then it hits you. How do you start? Which path should you take?

Do not despair. Let’s dive into the world of fine-tuning an LLM. Focusing on the benefits of fine-tuning an LLM is easy, but we must also consider the challenges or limitations imposed by each path and technique. Choosing the right path or techniques should be based on the balance you want to strive for between benefits and challenges for your particular use case.

## Sold into the Benefits

Fine-tuning an LLM brings tangible benefits easy to recognize:

- **Improved performance:** Fine-tuning allows the model to adapt to specific tasks or domains, improving accuracy and performance.
- **Customization:** Fine-tuning enables the model to learn and generate responses that align with the desired style, tone, or terminology specific to a particular application or use case.
- **Efficiency:** Building a model from scratch is computationally expensive. When starting from a pre-trained model, you leverage the existing knowledge of the pre-trained model and only add your unique expertise and knowledge.
- **Lower data requirements:** Fine-tuning requires fewer data samples than training a model from scratch.
- **Continuous improvements:** Fine-tuning your model enables your organization to continually improve and adapt to new data, staying up-to-date and relevant for your use case.

## The unspoken Challenges

While fine-tuning an LLM offers many benefits, it’s important to be aware of the challenges of the process. These challenges require a proactive effort to detect and address them:

- **Hyperparameter tuning & Overfitting:** Fine-tuning an LLM involves selecting the correct hyperparameters, such as learning rate, batch size, and number of epochs. Finding the optimal combination of hyperparameters can be a challenge. Setting hyperparameters too short can lead to underfitting, and setting hyperparameters too open can lead to overfitting. Underfitting leads to poor performance, and the model has minimal or no improvement. When a model overfits the training data, it struggles to generalize to new, unseen data. This can lead to poor performance on evaluation or real-world data. Adjusting the hyperparameters is a straightforward approach to remediate the fine-tuning process when the model is underfitting. Techniques, such as early stopping, regularization, and data augmentation, can be used to work around overfitting. Which one to use depends on your dataset and your use case.
- **Catastrophic forgetting:** This is one of the least discussed challenges with fine-tuning an LLM. Catastrophic forgetting is a phenomenon where the model forgets previously learned knowledge while fine-tuning on new data. This phenomenon is a significant challenge if your model needs to maintain performance across multiple tasks or domains. If the intent of fine-tuning an LLM is to specialize it in a single domain, then this might not be an issue. As you can see, it depends on your use case. Knowledge distillation, elastic weight consolidation, and progressive neural networks help address catastrophic forgetting.
- **Data quantity:** Obtaining or generating enough training and test data for your use case’s specific tasks or domains can be challenging. The lack of “enough” data may limit the model’s ability to generalize the knowledge within the desired domain. This statement raises the question of how much data is “enough.” Unfortunately, the answer is “it depends.” Many factors impact how much data is “enough”. For example, a thousand samples might be enough if the pre-trained model already has specific knowledge and expertise in the domain. If the pre-trained model has little to no expertise in the domain of your use case, then it might require hundreds of thousands of samples.
- **Data quality:** The data quality used to fine-tune an LLM significantly impacts the model’s performance. Ensuring the data is clean, relevant to the desired domain, and diverse is crucial for successful LLM fine-tuning.
- **Evaluation and interpretation:** Evaluating the performance of a fine-tuned LLM can be challenging, as traditional or academic metrics like perplexity, accuracy, and multitask language understanding (MMLU) may not be relevant or capture your fine-tuned model’s capabilities for the fine-tuned domain. For example, suppose you are fine-tuning the model with the expertise of your organization’s operational processes. How important is it that the resulting model has a low MMLU score because it cannot answer questions about black holes or philosophy? That is why you must put a lot of thought into what you need to measure to evaluate the fine-tuned model for your use case. Developing evaluation metrics and techniques appropriate for your use case is crucial for understanding the model’s strengths and weaknesses. It is not about using an off-the-shelf evaluation framework ([see examples](https://www.analyticsvidhya.com/blog/2023/05/how-to-evaluate-a-large-language-model-llm/#h-table-of-the-major-existing-evaluation-frameworks)) for traditional or academic metrics.

## Fine-Tuning Techniques

There are several techniques for fine-tuning LLMs, each with advantages and disadvantages.

1. **Full Fine-tuning:** This technique involves updating all the model’s parameters using task or domain-specific data.  
   **Advantages:**  
   - Achieves the best performance on specific tasks or domain  
   - Allow significant customization of the model’s behavior  
   **Disadvantages:**- This process is computationally expensive and requires a lot of memory  
   - Risk of catastrophic forgetting of original capabilities  
   - Requires a large amount of high-quality training data
2. **Parameter-Efficient Fine-tuning (PEFT):** This approach includes techniques like LoRA (Low-Rank Adaptation), which only updates a small subset of model parameters.  
   **Advantages:  
   -** More computationally efficient than full fine-tuning  
   - Reduces risk of catastrophic forgetting  
   - It can be effective with smaller datasets  
   **Disadvantages:  
   -** It may not achieve the same level of performance as full fine-tuning for some tasks or domains  
   - Limited in how much it can modify the model’s core capabilities
3. **Instruction Fine-tuning:** This approach involves training the model on examples demonstrating how to respond to specific instructions or prompts.  
   **Advantages:**- Improves the model’s ability to follow instructions and perform specific tasks  
   - Can enhance the model’s versatility across different use cases  
   **Disadvantages:**- It requires carefully crafted instruction-output pairs  
   - The fine-tuned model may not be as effective for tasks or domains that don’t fit an instruction format (e.g., it might not work for chats)
4. **Sequential Fine-tuning:** This method involves training an LLM on multiple related tasks and doing so in sequence.  
   **Advantages:**- Can improve performance on a series of related tasks  
   - Allows for iterative improvement of the model  
   **Disadvantages:**- Risk of forgetting earlier tasks (catastrophic forgetting)  
   - It can be time-consuming to implement effectively
5. **Prompt-tuning:** This technique should not be confused with Prompt Engineering; it involves optimization techniques to find the best prompt for a given task while keeping the pre-trained model parameters frozen. (See [Prompt Engineering vs Prompt Tuning: A Detailed Explanation](https://medium.com/@aabhi02/prompt-engineering-vs-prompt-tuning-a-detailed-explanation-19ea8ce62ac4#:~:text=Prompt%20engineering%20provides%20greater%20flexibility,the%20desired%20level%20of%20performance.))  
   **Advantages:**  
   - Very parameter-efficient  
   - It can be effective for task-specific adaptations  
   - Preserves the original model’s capabilities  
   **Disadvantages:**  
   - It may not achieve the same level of performance as more extensive fine-tuning methods for complex tasks.  
   - Requires careful design of the soft prompts  
   - Its effectiveness is dependent on the optimization algorithm

These are some of the most common techniques, but they are not an exhaustive list. When choosing fine-tuning techniques, consider your specific use case, the resources available, the quality and quantity of data, the level of customization desired, and the specific requirements. An effective and practical approach will combine one or more of these techniques.

By understanding these techniques, their benefits and challenges, and employing strategies to address them, you can find the path to effectively fine-tuning an LLM to leverage it for your use cases.
