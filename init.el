(tool-bar-mode -1)
(linum-mode t)

(defun op()
  (interactive)
  (find-file "~/.emacs.d/init.el") )

(global-set-key (kbd "<f2>") 'op)

(global-company-mode t)




