# Arguments

FIND ".foo" HAVE "length" NOT EQUAL "0"
FIND ".foo .bar" HAVE "length" NOT EQUAL "0"
FIND "[data-test='foo']" HAVE "length" NOT EQUAL "0"
FIND "[data-test='foo'] .bar" HAVE "length" NOT EQUAL "0"
FIND ".foo [data-test='bar']" HAVE "length" NOT EQUAL "0"
