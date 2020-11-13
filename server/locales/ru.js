module.exports = {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      update: 'Обновить',
    },
    flash: {
      errors: {
        403: 'Недостаточно прав',
        common: 'Произошла ошибка',
      },
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      user: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          success: 'Пользователь был удален',
        },
        update: {
          success: 'Данные пользователя были обновлены',
          error: 'Ошибка обновления',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        taskStatuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      taskStatus: {
        id: '#',
        name: 'Название',
      },
      user: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        fullName: 'Имя',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        profile: 'Профиль',
        delete: {
          delete: 'Удалить аккаунт',
          deleteConfirm: 'Восстановить аккаунт будет невозможно',
        },
        changePassword: {
          changePassword: 'Обновить пароль',
        },
        passwordPlaceholder: 'Новый пароль',
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
