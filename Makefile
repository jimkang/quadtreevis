include config.mk

HOMEDIR = $(shell pwd)

pushall: sync
	git push origin master

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) --exclude node_modules/ \
		--omit-dir-times --no-perms

