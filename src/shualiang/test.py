# -*- coding: UTF-8 -*- 
print '啦啦啦'

import urllib2
 
response = urllib2.urlopen("http://www.chatshi.com")
print response.read()