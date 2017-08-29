.PHONY: help

## Colors
COLOR_RESET			= \033[0m
COLOR_ERROR			= \033[31m
COLOR_INFO			= \033[32m
COLOR_COMMENT		= \033[33m
COLOR_TITLE_BLOCK	= \033[0;44m\033[37m
## Help
help:
	@printf "${COLOR_TITLE_BLOCK}UGOModularLicenseBundle Makefile${COLOR_RESET}\n"
	@printf "\n"
	@printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	@printf " make [target]\n\n"
	@printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	@awk '/^[a-zA-Z\-\_0-9\@]+:/ { \
		helpLine = match(lastLine, /^## (.*)/); \
		helpCommand = substr($$1, 0, index($$1, ":")); \
		helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
		printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

LASTCOMMIT = `cat ./bin/last-commit.version`

install:
	@echo installing...
	node ./scripts/last-commit.js current.version
	@echo $(LASTCOMMIT)
	rm -rf heroprotocol
	wget -O heroprotocol.zip https://github.com/Blizzard/heroprotocol/archive/master.zip
	unzip heroprotocol.zip
	mv heroprotocol-master heroprotocol
	cd ./heroprotocol/mpyq && python setup.py install
	rm heroprotocol.zip
	rm bin/current.version

build-command:
	@echo building scripts...
	node ./scripts/build-command.js

build: build-command
	@echo building...
	rm -rf bin/
	chmod +x ./scripts/build.sh
	./scripts/build.sh
	rm -rf ./scripts/build.sh

build-binary: install build write-last-commit clean-build

clean-build:
	@echo cleaning...
	rm -rf heroprotocol/

write-last-commit:
	node ./scripts/last-commit.js

sample:
	./bin/heroprotocol --messageevents test/ReplayParser/Sample.StormReplay
