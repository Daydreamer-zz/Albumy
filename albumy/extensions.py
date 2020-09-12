#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask_bootstrap import Bootstrap
from flask_mail import Mail
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, AnonymousUserMixin
from flask_dropzone import Dropzone
from flask_avatars import Avatars
from flask_wtf import CSRFProtect
from flask_whooshee import Whooshee

bootstrap = Bootstrap()
db = SQLAlchemy()
mail = Mail()
moment = Moment()
login_manager = LoginManager()
dropzone = Dropzone()
avatars = Avatars()
csrf = CSRFProtect()
whooshee = Whooshee()


@login_manager.user_loader
def load_user(user_id):
    from albumy.models import User
    user = User.query.get(int(user_id))
    return user


login_manager.login_view = 'auth.login'
login_manager.login_message_category = 'warning'
login_manager.refresh_view = 'auth.re_authenticate'
login_manager.needs_refresh_message_category = 'warning'
login_manager.needs_refresh_message = u'Sorry, for your safety, you need to relogin'


# Flask-Login提供的current_user是当前用户的代理对象，当用户未登陆时
# current_user执行的用户是Flask-Login提供的匿名用户类，这个类没有can()方法可调用
# 将未登陆的访客创建单独的类，并给他添加can()方法和is_admin属性
class Guest(AnonymousUserMixin):
    def can(self, permission_name):
        return False

    @property
    def is_admin(self):
        return False


login_manager.anonymous_user = Guest