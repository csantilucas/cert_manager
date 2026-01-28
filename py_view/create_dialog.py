import webview

def escolher_pasta(window):
    pasta = window.create_file_dialog(
        webview.FileDialog.FOLDER,
        allow_multiple=False
    )
    return pasta[0] if pasta else None


