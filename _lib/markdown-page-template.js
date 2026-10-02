// ==UserScript==
// @name        Markdown HTML Template
// @namespace   1330126-edexal
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description HTML Template for creating a markdown page
// ==/UserScript==
const MARKDOWN_PAGE_HTML = `
<div id="md-toc">
    <ul>
        <a href="#md-bold"><li>Bold</li></a>
        <a href="#md-italics"><li>Italic</li></a>
        <a href="#md-strikethrough"><li>Strikethrough</li></a>
        <a href="#md-inline-code"><li>Inline Code</li></a>
        <a href="#md-headings"><li>Headings</li></a>
        <a href="#md-link"><li>Link</li></a>
        <a href="#md-block-quote"><li>Block Quote</li></a>
        <a href="#md-code-block"><li>Code Block</li></a>
        <a href="#md-lists"><li>Lists</li></a>
        <a href="#md-underline"><li>Underline</li></a>
        <a href="#md-named-quotes"><li>Named Quotes</li></a>
        <a href="#md-inline-spoiler"><li>Inline Spoiler</li></a>
        <a href="#md-spoiler"><li>Spoiler</li></a>
        <a href="#md-alignment"><li>Alignment</li></a>
        <a href="#md-color"><li>Color</li></a>
    </ul>
</div>
<hr/>
<h3 id="md-bold">Bold</h3>

<p>Makes text <strong>BOLD</strong>.</p>

<pre><code>// Syntax: **&lt;text&gt;**
This is **a dummy** text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\**a dummy\\** text
</code></pre>
<hr>
<h3 id="md-italics">Italic</h3>

<p>Makes text <em>italic</em>.</p>

<pre><code>// Syntax: _&lt;text&gt;_
This is _a dummy_ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\_a dummy\\_ text.
</code></pre>
<hr>
<h3 id="md-strikethrough">Strikethrough</h3>

<p>Strikethrough a <del>selection</del> of text.</p>

<pre><code>// Syntax: ~~&lt;text&gt;~~
This is ~~a dummy~~ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\~~a dummy\\~~ text.
</code></pre>
<hr>
<h3 id="md-inline-code">Inline Code</h3>

<p>Place text in <code>monospace</code> code font.</p>

<pre><code>// Syntax: \`&lt;text&gt;\`
This is \`a dummy\` text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\\`a dummy\\\` text.
</code></pre>
<hr>
<h3 id="md-headings">Headings</h3>

<p>You can use headings <em>only up to level 3</em> (<code>###</code>).</p>

<pre><code>// Syntax: #&lt;text&gt;
# Level 1
## Level 2
### Level 3
</code></pre>
<hr>
<h3 id="md-link">Link</h3>

<p>Create a link to a <a href="https://sleazyfork.org/" rel="nofollow">URL</a></p>

<pre><code>// Syntax: [&lt;text to represent link&gt;](&lt;link to a URL&gt;)
This is [a dummy](https://sleazyfork.org) text.
</code></pre>
<hr>
<h3 id="md-block-quote">Block Quote</h3>

<blockquote>
<p>Create a generic block quote. </p>
</blockquote>

<pre><code>// Syntax: &gt;&lt;text&gt;
&gt; This is a dummy text.
&gt; Another dummy text!
&gt; 
&gt; Hey! You saw that gap?!?
</code></pre>
<hr>
<h3 id="md-code-block">Code Block</h3>

<pre><code>// Syntax: 
// \`\`\`
// &lt;text&gt;
// \`\`\`

\`\`\`
This is a dummy text inside a code block.
\`\`\`

// You can also specify a coding language.
// Syntax: 
// \`\`\`&lt;language to use&gt;
// &lt;text&gt;
// \`\`\`

\`\`\`python
variable = 10
min = 20

def func(x,y):
    return x + y * x
\`\`\`
</code></pre>
<hr>
<h3 id="md-lists">Lists</h3>

<p>Unordered &amp; Ordered lists are supported!</p>

<pre><code>// Ordered lists
// Syntax: &lt;digits&gt;. 
1. Wake up
2. Look at a mirror
3. Shower

// Unordered lists
// Syntax: -&lt;text&gt;
- Atemoya
- Avocado
- Alupag

// You can mix them and apply descendents. Each child indent level is 2 spaces.
1. This is a dummy text
  - I'm the dummy's child
  - Me too!
    1. Look! I'm a grandchild
    2. Me too, Brother!

- I'm a parent like dummy there.
  1. A number child
    - I'm number's child
  2. Number's lost sibling 
</code></pre>
<hr>
<h3 id="md-underline">Underline</h3>

<p>Apply <u>underline</u> to a string of text.</p>

<pre><code>// Syntax: __&lt;text&gt;__
This is __a dummy__ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\__a dummy\\__ text.
</code></pre>
<hr>
<h3 id="md-named-quotes">Named Quotes</h3>

<p>Same as <em>Block Quote</em> except new you can quote someone or something. </p>

<pre><code>// Syntax: &gt;&gt; &lt;Any words can be typed here&gt;
// NOTE: The first quote must use \`&gt;&gt;\`. Afterwards, use regular block quote, \`&gt;\`.

&gt;&gt; Johan Capri
&gt; Hello everyone!
&gt; Don't forget to like, subscribe, and hit that notification bell to 
&gt; always be up to date on the latest news!
</code></pre>
<hr>
<h3 id="md-inline-spoiler">Inline Spoiler</h3>

<p>Blur out some text.</p>

<pre><code>// Syntax: ||&lt;text&gt;||
This is ||a dummy|| text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\||a dummy\\|| text.
</code></pre>
<hr>
<h3 id="md-spoiler">Spoiler</h3>

<p>Hide a block of text behind a spoiler button.</p>

<pre><code>// Syntax:
// ::: spoiler
// &lt;text&gt;
// :::

::: spoiler
This is a dummy text.
:::

// You can also provide a description for the spoiler a
// Syntax:
// ::: spoiler=&lt;name of spoiler&gt;
// &lt;text&gt;
// :::

::: spoiler=Please do not open this spoiler!
This is a dummy text.
:::
</code></pre>
<hr>
<h3 id="md-alignment">Alignment</h3>

<p>Align text either <code>center</code> or <code>right</code>.</p>

<pre><code>// Syntax:
// &lt;&lt;&lt; &lt;right or center&gt;
// &lt;text&gt;
// &lt;&lt;&lt;

&lt;&lt;&lt; center
This is a dummy text.
&lt;&lt;&lt;

//Here's a right alignment example.
&lt;&lt;&lt; right
This is a dummy text.
&lt;&lt;&lt;
</code></pre>
<hr>
<h3 id="md-color">Color</h3>

<p>Apply hexidecimal color to <span style="color: green;">text</span>.</p>

<pre><code>// Syntax: 
// %&lt;#six-digit hexidecimal color code&gt;% &lt;text&gt; %%

This is %#ff03ff%a dummy%% text. 

// Escape using '\\%' on the end and start tags.

This is \\%#ff03ff%a dummy\\%% text. 
</code></pre>
    `;

