# SquidApi
1.Add IP to server
url: http://localhost:8000/api/users/addIp
params: startIp: 192.168.1.1, count: 3, subnet: 255.255.255.0
2.Show available proxies
http://localhost:8000/api/users/showAvailableProxies
No params
3.Add user
http://localhost:8000/api/users/addUser
username: webdev, password: 123
4.Assign IP to user
http://localhost:8000/api/users/setProxy
username: webdev, port: 8888, count: 3, days: 7
5.Show users expire date
http://localhost:8000/api/users/showExpire
username: webdev
6.Modify users expire date
http://localhost:8000/api/users/modifyExpire
username: webdev, edate: 2020-06-20
7.Show users proxy info
http://localhost:8000/api/users/showUserProxy
id:userid
8.Delete Ip from server
http://localhost:8000/api/users/deleteIp
startIp: 192.168.1.1, count: 3, subnet: 255.255.255.0
9.Delete user proxy
http://localhost:8000/api/users/deleteProxy
username: webdev
10.Delete user
http://localhost:8000/api/users/deleteUser
username: webdev
11.Shutdown proxy
http://localhost:8000/api/users/stopProxy
12.Start proxy
http://localhost:8000/api/users/startProxy
13.Show users proxy
http://localhost:8000/api/users/showProxies
14.Add Blacklist
http://localhost:8000/api/users/addBlacklist
url: www.xxxx.xyz
15.Show Blacklist
http://localhost:8000/api/users/showBlacklist
16.Delete Blacklist
http://localhost:8000/api/users/deleteBlacklist
url: www.xxxx.xyz
17.Random Proxies
http://localhost:8000/api/users/randomProxies
count: 3, days: 7
18.Change IP-Multiplier
http://localhost:8000/api/users/changeMulti
count: 10
19.Delete Random User + Proxies
http://localhost:8000/api/users/deleteRandomProxy
20.Get user list
http://localhost:8000/api/users/getUsers
