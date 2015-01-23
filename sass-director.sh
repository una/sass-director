#!/bin/bash
# ------------------------------------------------------------------------------
# Sass Director: generate Sass directory structures from Sass manifest files
#
# Bash script: Una Kravets, Jonathan Neal
# Licensed MIT: https://github.com/una/sass-director
# ------------------------------------------------------------------------------

function sass-director() {
	# declare local variables
	local BASE_DIRECTORY; local MANIFEST_FILE; local IFS; local IMPORT; local IMPORT_BASENAME; local IMPORT_DIRECTORY; local IMPORTS

	# set local Internal Field Separator as newline
	IFS=$'\n'

	# if no arguments
	if ! [ "$1" ]; then
		# print usage and return unsuccessfully
		echo "Usage: sass-director <manifest-file> <base-directory>" && return 1
	fi

	# set manifest file as first argument
	MANIFEST_FILE="$1"

	# if manifest file is missing
	if ! [ -f $1 ]; then
		# print the error and return unsuccessfully
		echo "Sorry, sass-director could not access '$MANIFEST_FILE'." && return 1
	fi

	# set the working path as the second argument or the directory of the manifest file
	BASE_DIRECTORY=${@[2]-$(dirname $MANIFEST_FILE)}

	# if the base directory cannot be accessed
	if ! mkdir -p $BASE_DIRECTORY; then
		# print the error and return unsuccessfully
		echo "Sorry, sass-director could not access '$BASE_DIRECTORY'." && return 1
	fi

	# parse the imports from the manifest file
	IMPORTS=( $(grep '^\s*@import\s\+' $MANIFEST_FILE) )

	# if no imports are found
	if [ ${#IMPORTS} -lt 1 ]; then
		# print the error and return unsuccessfully
		echo "Sorry, sass-director could not read any imports from that file." && return 1
	fi

	# for each import
	for IMPORT in $IMPORTS; do
		# capture the import path (with quotes)
		IMPORT=$(echo "$IMPORT" | sed -E 's/^[[:space:]]*@import[[:space:]]+|[[:space:]]*;[[:space:]]*$//g')

		# strip the quotes
		IMPORT=${IMPORT:1:${#IMPORT}-2}

		# if the import omits the .scss suffix
		if ! [[ "$IMPORT" == *.scss ]]; then
			# append the .scss suffix
			IMPORT=$IMPORT'.scss'
		fi

		# set the import basename
		IMPORT_BASENAME="_$(basename $BASE_DIRECTORY/$IMPORT)"

		# set the import directory
		IMPORT_DIRECTORY="$(dirname $BASE_DIRECTORY/$IMPORT)"

		# create the import directory
		mkdir -p $IMPORT_DIRECTORY

		# create the import file
		touch $IMPORT_DIRECTORY/$IMPORT_BASENAME
	done

	# print notification and return successfully
	echo "Hurray, sass-director created ${#IMPORTS} files!" && return 0
}
