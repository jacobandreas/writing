---
title: Stack trace integration in vim-ipython
layout: essay
categories: [tools]
---

I'm far too depenent on Vim to use a real IDE for developing, but I've recently
been frustrated by how primitive my python development workflow (consisting
mostly of `print` debugging) is. To fix this I've started `%run`ning things from
inside of IPython; this makes it easy to open up a `pdb` and prod the relevant
variables as necessary.

One annoyance remains: when it comes time to fix the error, I want to do it from
within the Vim window I already have open. But it would be nice if I could jump
straight to the location of the error (known to IPython) rather than having to
squint at the stack trace and then perform the necessary navigation myself.

`vim-ipython` provides various means of passing information back and forth
between Vim and an IPython console, some useful (docstrings) and some not, but
doesn't support integrated debugging of the kind I want. At least, it didn't
until this afternoon.

Various small adjustments need to be made in the message-passing between the Vim
plugin and IPython kernel to let Vim read the output of executed commands. (I'm
still confused about why the original version of the plugin doesn't do this.)
Then, the following nasty little python-Vimscript franken-function jumps to the
right place.

{% highlight python %}
function! IPythonTraceback()
python << EOF
command = """
import sys
import traceback
path, line = traceback.extract_tb(sys.last_traceback)[-1][0:2]
'edit +%d %s' % (line, path)
"""
reply = get_output(command)
vim.command(reply[1:-1])
EOF
endfunction
{% endhighlight %}

A Vim function invokes the python interpreter. The interpreted python program
constructs another python program on the fly, which in turn constructs a Vim
command. The python program is shipped off to IPython, which runs it and returns
the filled-in Vim command, which Vim then executes.

There's almost certainly a better way to do this, but I fear that if I spend any
longer on this the my lifetime gains from the automatic navigation will be
overwhelmed by the time wasted on plugin-writing.
