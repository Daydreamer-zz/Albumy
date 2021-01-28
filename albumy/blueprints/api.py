#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Blueprint, request, current_app, jsonify
from albumy.models import User
from albumy.utils import json_response
from albumy.utils import AttrDict
from albumy.extensions import db
import uuid
import time

api_bp = Blueprint('api', __name__)


@api_bp.route('/login', methods=['POST'])
def login():
    data = AttrDict(request.json)
    username = data.username
    password = data.password
    user = User.query.filter_by(email=username).first()
    if not user or not user.validate_password(password):
        return json_response(error={'error': 'Email address or password is wrong'})
    elif not user.token or int(user.expire_time) < int(time.time()):
        token = uuid.uuid4().hex
        expire_in = int(time.time() + 3600)
        user.token, user.expire_time = token, expire_in
        db.session.commit()
    else:
        token = user.token
        expire_in = user.expire_time
    return json_response({'token': token, 'expire_in': expire_in})