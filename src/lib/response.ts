import { NextResponse } from 'next/server';

function success200(data: { [key: string]: unknown }) {
  const json = {
    success: true,
    message: 'Success',
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 200 });
}

function success201(data: { [key: string]: unknown }) {
  const json = {
    success: true,
    message: 'Created successfully',
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 201 });
}

function error500(data: { [key: string]: unknown }) {
  const json = {
    success: false,
    message: 'Something went wrong. SVR',
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 500 });
}

function error404(message: string, data?: { [key: string]: unknown }) {
  const json = {
    success: false,
    message,
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 404 });
}

function error400(message: string, data?: { [key: string]: unknown }) {
  const json = {
    success: false,
    message,
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 400 });
}

function error403(message?: string) {
  const json = {
    success: false,
    message:
      message || 'Forbidden: You are not authorized to perform this action!',
  };
  return NextResponse.json(json, { status: 403 });
}

function error401(message: string, data?: { [key: string]: unknown }) {
  const json = {
    success: false,
    message,
  };
  const resJson = { ...json, ...data };
  return NextResponse.json(resJson, { status: 401 });
}

function error409(message: string) {
  const json = {
    success: false,
    message,
  };
  return NextResponse.json(json, { status: 409 });
}

export {
  success200,
  success201,
  error500,
  error404,
  error403,
  error400,
  error401,
  error409,
};
