import * as v from 'valibot'

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.toLowerCase(), v.email('Email không hợp lệ')),
  password: v.pipe(v.string(), v.minLength(6, 'Mật khẩu tối thiểu 6 ký tự')),
  rememberMe: v.optional(v.boolean(), false)
})

export type LoginInput = v.InferOutput<typeof LoginSchema>

export const RefreshSchema = v.object({
  refreshToken: v.optional(v.string())
})
export type RefreshInput = v.InferOutput<typeof RefreshSchema>
