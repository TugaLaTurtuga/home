
## 1. Headings

# H1

## H2

### H3

#### H4

##### H5

###### H6

---

## 2. Text Formatting

- **Bold text**
- *Italic text*
- ***Bold + Italic***
- ~~Strikethrough~~
- `Inline code`

---

## 3. Paragraphs & Line Breaks

This is a paragraph.  
This is another line in the same paragraph with two spaces at the end.  

This is a new paragraph.

---

## 4. Lists

### 4.1 Tasks

- [ ] Incomplete task
- [x] Completed task
- [-] Todo task

### 4.2 Unordered List

- Item 1
- Item 2
  - Subitem 2a
  - Subitem 2b
- Item 3

### 4.3 Ordered List

1. First
2. Second
3. Third
    1. Subitem 3a
    2. Subitem 3b

---

## 5. Links, Images & htmls

- [GitHub](https://github.com/TugaLaTurtuga)
- Inline image:

![Markdown Logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)

- Link to another blog:  
  [Other blog](./test)

- Insert image from itself:  
  ![img](./test/icon.png)

- Insert html from itself:  
  [html](./test/code/test.html)

---

## 6. Blockquotes

### 6.1 Normal blockquotes

> This is a blockquote.
>
>
> - You can also have lists
> - Inside blockquotes

### 6.2 Notes, Tips, and Cautions

> [!NOTE]
> This is a note. Use it for extra information.

> [!TIP]
> This is a note. Use it for extra information.

> [!IMPORTANT]
> This is a note. Use it for extra information.

> [!WARNING]
> This is e note. Use it for extra information.

> [!ERROR]
> This is a note. Use it for extra information.

> [!CAUTION]
> This is a note. Use it for extra information.

> [!BUG]
> This is a note. Use it for extra information.

---

## 8. Code Blocks

### 8.1 Inline Code

Use `print("Hello World")` inside text.

### 8.2 Fenced Code Block

```python {fillename="demo.py"}
def main() -> None:
    sum = 0
    for i in range(10):
        sum += i
    print(sum)

if __name__== "__main__":
    main()
```

## 9. Tables

Feature Example

| Feature       | Left | Center | Right |
|---------------|:-----|:------:|------:|
| Default text  | example | example | example |
| Bold          | **exanple** | **exanple** | **exanple** |
| Italic        | *exemple* | *example* | *example* |
| Code          | `example()` | `example()` | `example()` |

## 10. Maths using LaTeX

$\sqrt{3x - 1} + (1 - x)^2$

Inline $\sqrt{3x - 1} + (1 - x)^2$ LaTeX

$$
\sqrt{3x - 3} + (1 + x)^2
$$