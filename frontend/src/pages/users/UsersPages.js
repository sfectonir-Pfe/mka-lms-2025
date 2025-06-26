import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

export default function UsersPages() {
  const { t } = useTranslation()
  return (
    <div>{t('users.usersSection')}

        <Outlet />
    </div>
  )
}
