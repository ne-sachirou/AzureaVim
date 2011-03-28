<h1>Include</h1>
Closure Compiler - 2009 Google Inc. Apache License, Version 2.0

<h1>AzureaVim</h1>
<p>Highly customized and more customizable interface for Azurea.</p>
<p><a href="http://azurea.refy.net/ja/wiki/index.php">Azurea</a> is a simple and powerful Twitter client. From it&apos;s Wiki,</p>
<blockquote cite="http://azurea.refy.net/ja/wiki/index.php?Azurea%E3%81%A8%E3%81%AF">
<h1>Azureaとは </h1>
Windows Mobile向けのついったクライアント。とってもシンプル。

<h2>機能は？ </h2>
<ul>
  <li>とってもシンプルなユーザインターフェース</li>
  <li>リプライがツリーになります</li>
  <li>メモリ消費がわりと軽かったのですが、最近そうでもなくなってきました。</li>
  <li>もちろんパンスクロールできます</li>
</ul>
</blockquote>
<p>Addtionally, it&apos;s most largest feature is that <b>Azurea can be highly extended by JScript.</b></p>
<p><b>AzureaVim</b> gives wider environment for Azurea. It&apos;s contain <b>AzureaStartup.js</b>, <b>ApiProxy.rb</b> and <b>AzureaVim.js</b>. All is <b>open sourced</b> under MIT License, so you can develop AzureaVim with us.</p>
<p><a href="https://github.com/ne-sachirou/AzureaVim/blob/master/js/AzureaVim.js">js/AzureaVim.js</a> is our core.</p>
<p><a href="https://github.com/ne-sachirou/AzureaVim/blob/master/js/AzureaStartup.js">js/AzureaStartup.js</a></p>
<p><a href="https://github.com/ne-sachirou/AzureaVim/blob/master/src/apiproxy/ApiProxy.rb">src/apiproxy/ApiProxy.rb</a></p>
<p> is easy setup tool.</p>

<h2>Installation</h2>
<h3>Easy install</h3>

<h3>Install manually</h3>


<h2>Basical usage</h2>
<ol>
  <li>Select a timeline status.</li>
  <li>Press <q>:</q>, then input <q>:</q> to TextArea and focus automatically.</li>
  <li>Input command</li>
  <li>Press Enter to send tweet</li>
  <li>You&apos;ll see the command is done.</li>
</ol>

<h2>Feature list</h2>
<ul>
  <li>Meny :commands (extensible)</li>
  <li>addEventListener, removeEventListener</li>
  <li>setTimeout, clearTimeout, setInterval, clearInterval, setTimeevent, clearTimeevent</li>
  <li>template</li>
  <li>yank</li>
  <li>Customizable notification using <b>Growl for Windows</b>.</li>
</ul>

<h2>Command list</h2>
<p>Read <a href="https://github.com/ne-sachirou/AzureaVim/tree/master/src/plugins">src/plugins</a> js source comments.</p>

<h2>License</h2>
<pre>The MIT License

Copyright (c) 2011 <a href="http://c4se.sakura.ne.jp/profile/ne.html">ne_Sachirou</a>

Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.</pre>