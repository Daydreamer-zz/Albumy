#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pymysql
from faker import Faker

fake = Faker('zh-CN')
conn = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='199747',
    database='test',
    charset='utf8'
)

cursor = conn.cursor()

for i in range(10):
    sql = f"INSERT INTO a (username, address, name, phone) " \
          f"VALUES ('{fake.user_name()}','{fake.address()}','{fake.name()}','{fake.phone_number()}');"
    # print(sql)
    cursor.execute(sql)

conn.commit()
cursor.close()
conn.close()