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

APP_DIR=Tests/Fixtures/app

install:
	@echo installing...
	rm -rf heroprotocol
	wget -O heroprotocol.zip https://github.com/Blizzard/heroprotocol/archive/master.zip
	unzip heroprotocol.zip
	mv heroprotocol-master heroprotocol
	python ./heroprotocol/mpyq/setup.py install
	rm heroprotocol.zip

sample:
	python ./heroprotocol/heroprotocol.py --messageevents test/ReplayParser/Sample.StormReplay
