"""Concatenate the game sources into a single self-contained index.html."""
import glob, os
root = os.path.dirname(os.path.abspath(__file__))
js = "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(os.path.join(root, "src", "*.js"))))
shell = open(os.path.join(root, "src", "shell.html"), encoding="utf-8").read()
out = shell.replace("/*__JS__*/", js)
open(os.path.join(root, "index.html"), "w", encoding="utf-8").write(out)
print("built index.html,", len(out), "bytes")
