#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Blueprint, request, current_app, jsonify
from albumy.models import User
from albumy.utils import json_response

api_bp = Blueprint('api', __name__)


@api_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        print(request.get_data())
        return json_response({'status': 'ok', 'data': 'aaaaa'})