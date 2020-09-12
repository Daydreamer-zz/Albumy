#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import url_for
from albumy.models import Notification
from albumy.extensions import db


# 推送关注提醒
def push_follow_notification(follower, receiver):
    message = f"""User <a href="{url_for("user.index", username=follower.username)}">{follower.username}</a> follow you"""
    notification = Notification(message=message, receiver=receiver)
    db.session.add(notification)
    db.session.commit()


# 推送评论提醒
def push_comment_notification(photo_id, receiver, page=1):
    message = f"""<a href="{url_for('main.show_photo', photo_id=photo_id, page=page)}#comments">This photo</a> has new comment/reply"""
    notification = Notification(message=message, receiver=receiver)
    db.session.add(notification)
    db.session.commit()


# 推送收藏提醒
def push_collect_notification(collector, photo_id, receiver):
    message = f"""User <a href="{url_for('user.index', username=collector.username)}">{collector.username}</a> collected  your 
<a href="{url_for('main.show_photo', photo_id=photo_id)}">photo</a>"""
    notifiaction = Notification(message=message, receiver=receiver)
    db.session.add(notifiaction)
    db.session.commit()