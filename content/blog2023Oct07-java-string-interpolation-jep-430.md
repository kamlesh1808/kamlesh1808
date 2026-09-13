---
title: "Java String Interpolation - JEP 430"
date: 2023-10-07
excerpt: Exploring Java string interpolation and the String Templates preview in JEP 430
tags: [Java, Kotlin]
source: LinkedIn
disabled: false
aiAssisted: false
---

Interpolation is defined as something that is introduced or inserted.

String interpolation, a concept in programming languages, means inserting or injecting a variable into a string.

In Java, there are several ways of achieving string interpolation:

- Concatenation operator, also known as the plus operator
- `format()` function
- `MessageFormat.format`
- `StringBuilder` class

According to [JEP 430](https://openjdk.org/jeps/430), String Templates offer a new way that was in the Preview state. It offers the `STR` template processor, for example:

```java
String nameString = STR."My first is \{firstName} and last name is \{lastName}";
```

I would prefer to use the `STR` template processor implicitly. For example:

```java
String nameString = "My first is \{firstName} and last name is \{lastName}";
```

JEP 430 states that this was considered but not adopted.

My preference is also to use `$` instead of `\`, for example:

```java
String nameString = "My first is ${firstName} and last name is ${lastName}";
```

[Kotlin](https://kotlinlang.org/), which I call the sister language of Java, already implements this.

What are your thoughts?

[Originally published on LinkedIn](https://www.linkedin.com/posts/kamlesh1808_java-string-interpolation-jep-430-interpolation-activity-7116489386585726976-1ni7).
