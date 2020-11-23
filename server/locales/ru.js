module.exports = {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      update: 'Обновить',
      new: 'Создать',
      edit: 'Редактировать',
      submit: 'Применить',
    },
    flash: {
      errors: {
        401: 'Необходима авторизация',
        403: 'Недостаточно прав',
        common: 'Произошла ошибка',
      },
      session: {
        create: {
          success: 'Вы вошли',
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
      taskStatus: {
        delete: {
          success: 'Статус был удален',
        },
        new: {
          success: 'Статус был создан',
        },
        edit: {
          success: 'Статус был обновлен',
        },
      },
      label: {
        delete: {
          success: 'Метка была удалена',
        },
        new: {
          success: 'Метка была создана',
        },
        edit: {
          success: 'Метка была обновлена',
        },
      },
      task: {
        delete: {
          success: 'Задача была удалена',
        },
        new: {
          success: 'Задача была создана',
        },
        edit: {
          success: 'Задача была обновлена',
        },
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        taskStatuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
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
      task: {
        table: 'Задачи',
        name: 'Название',
        executor: 'Исполнитель',
        status: 'Статус',
        labels: 'Метки',
        nonExecutor: 'Не назначен',
        creator: 'Автор',
        new: 'Новая задача',
        description: 'Описание',
        executorId: 'Исполнитель',
        statusId: 'Статус',
        edit: 'Изменить задачу',
        delete: 'Удалить задачу',
        info: 'Информация о задаче',
      },
      taskStatus: {
        id: '#',
        name: 'Название',
        new: 'Новый статус',
        delete: 'Удалить статус',
        table: 'Статусы',
        edit: 'Редактировать статус',
      },
      label: {
        id: '#',
        name: 'Название',
        new: 'Новая метка',
        delete: 'Удалить метку',
        table: 'Метки',
        edit: 'Редактировать метку',
      },
      user: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        fullName: 'Имя',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        table: 'Пользователи',
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
