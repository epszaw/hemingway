OPEN "https://google.com"
FIND "#lst-ib" AS "search-input"
TAKE "search-input" TYPE "Hello{Enter}"
FIND ".bkWMgd" HAVE "length" NOT EQUAL "0"
