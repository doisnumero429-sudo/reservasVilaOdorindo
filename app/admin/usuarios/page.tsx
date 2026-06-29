import EmConstrucao from '../EmConstrucao';
export default function Page() {
  return (
    <EmConstrucao
      titulo="Usuários"
      descricao="Administradores e permissões (tabela admin_users)."
      itens={['Funções: owner, manager, reception, viewer', 'Ativar/desativar usuário', 'Convidar novos administradores']}
    />
  );
}
