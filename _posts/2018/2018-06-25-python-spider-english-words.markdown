---
layout: post
title: Scraping Graduate Entrance Vocabulary with Python
subtitle: "The World Cup isn’t an excuse to stop learning"
date: 2018-06-25 22:01:21
author: Morgan
tags: 
    - python
    - Web Scraping
    - practice_project
---

I’m preparing for a part-time graduate program and recently started reviewing vocabulary. Most online word lists look like endless paginated tables—clicking through them wastes time. A small Python spider can fetch the content and save it locally, so let’s build one.

<!-- more -->

### Inspecting the target site

I used a list from Kuakao (*http://www.kuakao.com/english/ch/39183.html*). First, check `robots.txt` to ensure the section isn’t disallowed. Chrome’s “View page source” or “Inspect” tools help locate the relevant markup; the words live inside a `<div class="artTxt">` block.

### Fetching the page

```python
import requests

try:
    base_url = 'http://www.kuakao.com/english/ch/39183.html'
    r = requests.get(base_url)
    print(r.content)
except Exception as e:
    print(e)
```

The raw response contains garbled characters such as `\xe4\xba\x8e`. Fix the encoding and add a user agent:

```python
import requests
from bs4 import BeautifulSoup

try:
    base_url = 'http://www.kuakao.com/english/ch/39183.html'
    headers = {
        'User-Agent': ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) '
                       'AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/41.0.2227.1 Safari/537.36')
    }
    r = requests.get(base_url, headers=headers)
    r.encoding = r.apparent_encoding
    soup = BeautifulSoup(r.content, 'lxml')
    print(soup.prettify()[:500])
except Exception as e:
    print(e)
```

Now the HTML renders correctly and is easier to parse.

### Extracting the content

Use BeautifulSoup to isolate the word list:

```python
word_container = soup.find('div', class_='artTxt')
```

Some extra text still slips in, so add filtering logic to strip the tail section. The links below offer deeper dives into BeautifulSoup:

- [BeautifulSoup documentation (Chinese translation)](https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/)
- [Cui Qingcai’s guide](https://cuiqingcai.com/1319.html)

### Persisting results

Write the words to disk:

```python
with open('word.txt', 'w', encoding='utf-8') as f:
    for word in word_list:
        f.write(word)
        f.write('\n')
```

### Handling pagination

The site spans 66 pages, so split the URL and iterate:

```python
base = 'http://www.kuakao.com/english/ch/39{page}.html'
for offset in range(66):
    url = base.format(page=183 + offset)
    # fetch and parse
```

Break the scraper into two functions:

1. `get_english_words(page)`
2. `write_words_to_file(word_list)`

I added a progress bar with `tqdm` for better feedback during long runs.

### Takeaways

Most of the effort in web scraping lies in inspecting the markup, cleaning the data, and iterating on edge cases. Writing the core code is the easy part. Stay patient, respect target sites, and practise often.

Source code: [GitHub repository](https://github.com/goelo/machine_learning/tree/master/project/crawling_english_words)

Thanks for reading! Let me know if you spot improvement ideas.
